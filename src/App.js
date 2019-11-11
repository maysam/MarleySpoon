import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Breadcrumb,
  List,
  Empty,
  Icon,
  Descriptions,
  Card,
  Tag,
  Menu,
  Layout,
  Button
} from 'antd'
import Recipe from './components/recipe'
import Recipes from './components/recipes'
import data from './data.js'
import './App.css'

const { Content, Header, Sider } = Layout

const space = 'kk2bw5ojx476'
const token = '7ac531648a1b5e1dab6c18b0979f822a5aad0fe5f1109829b8a197eb2be4b84c'
const url = 'https://cdn.contentful.com/spaces/' + space + '/entries'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recipes: null,
      chefs: null,
      tags: null
    }
  }

  componentDidMount() {
    this.loadRecipes()
  }
  // {
  //   "sys": { "type": "Array" },
  //   "skip": 0,
  //   "limit": 100,
  //   "total": 1256,
  //   "items": [ /* 100 individual resources */ ]
  // }
  loadRecipes = () => {
    const chefs = {}
    const tags = {}
    const recipes = {}
    const assets = {}
    // fetch(url + '&id=' + city.id)
    // .then(response => response.json())
    // .then(data => {
    data.includes.Asset.forEach(({ sys: { id }, fields }) => {
      assets[id] = fields
    })
    data.items.forEach(({ sys: { id, contentType, type }, fields }) => {
      switch (contentType.sys.id) {
        case 'tag':
          tags[id] = fields.name
          break
        case 'chef':
          chefs[id] = fields.name
          break
        case 'recipe':
          recipes[id] = fields
          for (var i = 9; i >= 0; i--) {
            recipes[i + id] = fields
          }

          break
        default:
          console.warn('content type ' + contentType.sys.id + ' not handled!!!')
      }
    })
    this.setState({ chefs, tags, recipes, assets })
    // })
    // .catch(error => console.error(error))
  }

  selectRecipe = selectedRecipe => {
    this.setState({ selectedRecipe })
  }

  render() {
    const { recipes, assets, chefs, tags, selectedRecipe } = this.state

    if (recipes === null) {
      return <Empty />
    }
    let card = null
    let cards = null
    if (selectedRecipe) {
      window.selectedRecipe = selectedRecipe
      console.log(Object.keys(selectedRecipe))
      console.log(assets[selectedRecipe.photo.sys.id].file)
      const photo = assets[selectedRecipe.photo.sys.id]
      const cover = !photo ? null : (
        <img alt={photo.title} src={photo.file.url} />
      )

      card = (
        <Card
          cover={cover}
          title={
            <Descriptions
              title={selectedRecipe.title}
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              {selectedRecipe.chef && (
                <Descriptions.Item label="Chef">
                  {chefs[selectedRecipe.chef.sys.id]}
                </Descriptions.Item>
              )}
              {selectedRecipe.tags && (
                <Descriptions.Item>
                  {selectedRecipe.tags.map(({ sys: { id } }) => (
                    <Tag color="magenta" key={id}>
                      {tags[id]}
                    </Tag>
                  ))}
                </Descriptions.Item>
              )}
            </Descriptions>
          }
        >
          <ReactMarkdown source={selectedRecipe.description} />
        </Card>
      )
    } else {
      cards = (
        <List
          grid={{
            gutter: 16,
            column: 4,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 6
          }}
          dataSource={Object.keys(recipes).map(id => {
            return { id, ...recipes[id] }
          })}
          renderItem={recipe => {
            const photo = assets[recipe.photo.sys.id]
            const cover = !photo ? null : (
              <img alt={photo.title} src={photo.file.url} />
            )
            return (
              <List.Item onClick={() => this.selectRecipe(recipe)}>
                <Card
                  title={recipe.title}
                  cover={cover}
                  bodyStyle={{ display: 'none' }}
                />
              </List.Item>
            )
          }}
        />
      )
    }
    return (
      <Layout className="App">
        <Header className="App-header header">
          <span>Marley Spoon</span>
          <Button type="primary" onClick={() => this.loadRecipes()}>
            Reload
          </Button>
        </Header>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            <Breadcrumb>
              <Breadcrumb.Item onClick={() => this.selectRecipe()}>
                All Recipes
              </Breadcrumb.Item>
              {selectedRecipe && (
                <Breadcrumb.Item>{selectedRecipe.title}</Breadcrumb.Item>
              )}
            </Breadcrumb>

            {(selectedRecipe && card) || cards}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default App
