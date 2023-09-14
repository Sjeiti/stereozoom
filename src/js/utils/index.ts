export * from './drag'

export function createElement(name, parent=null, attr=null){
  const element = document.createElement(name)
  attr&&Object.entries(attr).forEach(([name, value])=>{
    name in element
      ?element[name] = value
      :element.setAttribute(name==='className'?'class':name, value)
  })
  parent?.appendChild(element)
  return element
}
