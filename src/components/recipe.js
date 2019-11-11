import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Descriptions, Card, Tag } from 'antd'

export default ({ cover, title, chef, tags, description }) => (
  <Card
    cover={cover}
    title={
      <div>
        <Descriptions
          title={title}
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          {chef && (
            <Descriptions.Item label="Chef">
              {chef}
            </Descriptions.Item>
          )}
          {tags && (
            <Descriptions.Item>
              {tags.map(({ id, tag }) => (
                <Tag color="magenta" key={id}>
                  {tag}
                </Tag>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    }
  >
    <ReactMarkdown source={description} />
  </Card>
)
