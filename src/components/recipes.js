import React from 'react'
import { List, Card } from 'antd'

export default ({ recipes, assets, selectRecipe }) => (
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
    dataSource={Object.keys(recipes)
      .sort(() => Math.random() - 0.5)
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
