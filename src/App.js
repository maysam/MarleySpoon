import React, { Component } from 'react'
import {
  Breadcrumb,
  Empty,
  Layout,
  Button
} from 'antd'
import Recipe from './components/recipe'
import Recipes from './components/recipes'
import data from './data.js'
import './App.css'

const { Content, Header } = Layout

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

    const photo = selectedRecipe && assets[selectedRecipe.photo.sys.id]
    const cover = photo && <img alt={photo.title} src={photo.file.url} />

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

            {(selectedRecipe && (
              <Recipe
                cover={cover}
                title={selectedRecipe.title}
                tags={
                  selectedRecipe.tags &&
                  selectedRecipe.tags.map(({ sys: { id } }) => {
                    return { id, tag: tags[id] }
                  })
                }
                chef={selectedRecipe.chef && chefs[selectedRecipe.chef.sys.id]}
                description={selectedRecipe.description}
              />
            )) || <Recipes recipes={recipes} assets={assets} selectRecipe={this.selectRecipe} />}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default App
