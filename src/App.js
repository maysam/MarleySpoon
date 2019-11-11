import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { Descriptions, Card, Tag, Menu, Layout, Button } from 'antd'
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
    this.updateWeather()
  }
  // {
  //   "sys": { "type": "Array" },
  //   "skip": 0,
  //   "limit": 100,
  //   "total": 1256,
  //   "items": [ /* 100 individual resources */ ]
  // }
  updateWeather = () => {
    const chefs = {}
    const tags = {}
    const recipes = {}
    // fetch(url + '&id=' + city.id)
    // .then(response => response.json())
    // .then(data => {
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
          break
        default:
          console.warn('content type ' + contentType.sys.id + ' not handled!!!')
      }
    })
    this.setState({ chefs, tags, recipes })
    // })
    // .catch(error => console.error(error))
  }

  selectMenu = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    this.setState({ selectedRecipeKey: key })
  }

  render() {
    const { recipes, chefs, tags, selectedRecipeKey } = this.state

    if (recipes === null) {
      return <div>Loading</div>
    }
    const selectedRecipe = recipes[selectedRecipeKey]
    if (selectedRecipeKey) {
      window.selectedRecipe = selectedRecipe
      console.log(Object.keys(selectedRecipe), selectedRecipe.photo.sys.id)
    }
    return (
      <Layout className="App">
        <Header className="App-header">
          <span>Marley Spoon</span>
          <Button type="primary" onClick={() => this.updateWeather()}>
            Reload
          </Button>
        </Header>
        <Layout>
          <Sider>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              onClick={this.selectMenu}
            >
              {Object.keys(recipes).map(id => (
                <Menu.Item key={id}>
                  <span>{recipes[id].title}</span>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Content>
            {selectedRecipeKey && (
              <Card
                title={
                  <Descriptions title={selectedRecipe.title}>
                    {selectedRecipe.chef && (
                      <Descriptions.Item label="Chef">
                        {chefs[selectedRecipe.chef.sys.id]}
                      </Descriptions.Item>
                    )}

                    <Descriptions.Item label="Calories">
                      {selectedRecipe.calories}
                    </Descriptions.Item>
                    {selectedRecipe.tags && (
                      <Descriptions.Item>
                        {selectedRecipe.tags.map(({ sys: { id } }) => (
                          <Tag color="magenta">{tags[id]}</Tag>
                        ))}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                }
              >
                <ReactMarkdown source={selectedRecipe.description} />
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default App
