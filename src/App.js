import React, { Component } from 'react'
import { Breadcrumb, Empty, Layout, Button } from 'antd'
import Recipe from './components/recipe'
import Recipes from './components/recipes'
import './App.css'

const { Content, Header } = Layout

const space = 'kk2bw5ojx476'
const token = '7ac531648a1b5e1dab6c18b0979f822a5aad0fe5f1109829b8a197eb2be4b84c'
const url = 'https://cdn.contentful.com/spaces/' + space + '/entries'

class App extends Component {
  state = {
    loading: true,
    recipes: {},
    chefs: {},
    tags: {},
    assets: {}
  }

  componentDidMount() {
    this.loadRecipes()
  }

  loadRecipes = (skip = 0) => {
    const { chefs, tags, recipes, assets } = this.state
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
    fetch(url + '?skip=' + skip, { headers })
      .then(response => response.json())
      .then(data => {
        data.includes &&
          data.includes.Asset.forEach(({ sys: { id }, fields }) => {
            assets[id] = fields
          })
        data.items &&
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
                console.warn(
                  'content type ' + contentType.sys.id + ' not handled!!!'
                )
            }
          })
        this.setState({
          chefs,
          tags,
          recipes,
          assets,
          total: data.total,
          skip: data.skip,
          limit: data.limit,
          loading: false
        })
      })
      .catch(error => console.error(error))
  }

  selectRecipe = selectedRecipe => {
    this.setState({ selectedRecipe })
  }

  onLoadMore = () => {
    const { total, skip, limit } = this.state
    if (skip + limit < total) {
      this.setState({ loading: true }, () => {
        this.loadRecipes(skip + limit)
      })
    }
  }

  render() {
    const {
      total,
      skip,
      limit,
      loading,
      recipes,
      assets,
      chefs,
      tags,
      selectedRecipe
    } = this.state

    const loadMore =
      skip + limit < total && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px'
          }}
        >
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null

    const photo = selectedRecipe && assets[selectedRecipe.photo.sys.id]
    const cover = photo && <img alt={photo.title} src={photo.file.url} />

    return (
      <Layout className="App">
        <Header className="App-header header">
          <span>Marley Spoon</span>
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
            )) ||
              (recipes && (
                <Recipes
                  loadMore={loadMore}
                  recipes={recipes}
                  assets={assets}
                  selectRecipe={this.selectRecipe}
                />
              )) || <Empty />}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default App
