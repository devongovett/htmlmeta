import {parseDimension} from '../utils';

export default function schemaToOembed(schema, url) {
  let type = (schema['@type'] || '').replace('http://schema.org/', '');
  let image = getImage(schema.image) || getImage(schema.primaryImageOfPage) || getImage(schema.thumbnail) || getImage(schema.thumbnailUrl) || {};
  let thumbnail = getImage(schema.thumbnail) || {};
  let author = getAuthor(schema.author || schema.creator || schema.producer || schema.contributor) || {};
  
  switch (type) {
    case 'Article':
    case 'NewsArticle':
    case 'BlogPosting':
    case 'WebPage':
      return {
        version: '1.0',
        type: 'link',
        url: schema.url || url,
        title: schema.headline || schema.alternativeHeadline,
        description: schema.description,
        thumbnail_url: image.contentUrl,
        thumbnail_width: image.width,
        thumbnail_height: image.height,
        author_name: author.name,
        author_url: author.url,
        posted_at: schema.datePublished || schema.dateCreated || schema.dateModified
      };
      
    case 'ImageObject':
      return {
        version: '1.0',
        type: 'photo',
        url: schema.contentUrl || schema.contentURL,
        link: schema.url || url,
        width: parseDimension(schema.width),
        height: parseDimension(schema.height),
        thumbnail_url: thumbnail.contentUrl,
        thumbnail_width: thumbnail.width,
        thumbnail_height: thumbnail.height,
        title: schema.caption || schema.name,
        description: schema.description,
        author_name: author.name,
        author_url: author.url,
        posted_at: schema.datePublished || schema.dateCreated || schema.dateModified
      };
      
    case 'VideoObject':
      return {
        version: '1.0',
        type: 'video',
        url: schema.contentUrl || schema.contentURL || schema.embedUrl || schema.embedURL,
        link: schema.url || schema.embedUrl || url,
        width: parseDimension(schema.width),
        height: parseDimension(schema.height),
        thumbnail_url: image.contentUrl,
        thumbnail_width: image.width,
        thumbnail_height: image.height,
        title: schema.name || schema.caption,
        description: schema.description,
        author_name: author.name,
        author_url: author.url,
        posted_at: schema.datePublished || schema.dateCreated || schema.dateModified
      };
  }
}

function getImage(image) {
  if (typeof image === 'string') {
    return {
      contentUrl: image
    };
  }
  
  if (image) {
    image.contentUrl = image.contentUrl || image.url;
    image.width = parseDimension(image.width);
    image.height = parseDimension(image.height);
  }
  
  return image;
}

function getAuthor(author) {
  if (typeof author === 'string') {
    return {
      name: author.trim()
    };
  }
  
  if (Array.isArray(author)) {
    return {
      name: author.map(author => (getAuthor(author).name || '').trim()).filter(Boolean).join(', ') || undefined
    };
  }
  
  if (typeof author === 'object') {
    if (!author.name && (author.givenName || author.familyName)) {
      author.name = [author.givenName, author.familyName].filter(Boolean).join(' ');
    }
    
    author.url = author.url || author.href;
    return author;
  }
}
