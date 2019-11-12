import React from 'react'
import { List, Card } from 'antd'

export default ({ recipes, assets, selectRecipe, loadMore }) => (
  <List
    grid={{
      gutter: 16,
      column: 4,
      xs: 1,
      sm: 1,
      md: 2,
      lg: 2,
      xl: 3,
      xxl: 4
    }}
    loadMore={loadMore}
    dataSource={Object.keys(recipes)
      .map(id => {
        return { id, ...recipes[id] }
      })}
    renderItem={recipe => {
      const photo = recipe.photo && assets[recipe.photo.sys.id]
      const cover = photo && <img alt={photo.title} src={photo.file.url} />

      return (
        <List.Item onClick={() => selectRecipe(recipe)}>
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
