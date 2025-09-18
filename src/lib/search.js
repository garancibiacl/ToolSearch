import Fuse from 'fuse.js'

export function createFuseIndex(items){
  return new Fuse(items,{
    includeScore:true,
    threshold:0.34,
    ignoreLocation:true,
    minMatchCharLength:2,
    keys:[
      {name:'nombre',weight:.6},
      {name:'alt',weight:.2},
      {name:'tags',weight:.2}
    ]
  })
}

export function smartFilter(banners,query){
  if(!query) return [...banners].sort((a,b)=> (b.createdAt||0)-(a.createdAt||0))
  const fuse=createFuseIndex(banners)
  return fuse.search(query).map(r=>r.item)
}
