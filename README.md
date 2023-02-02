### Pastpaperslk Web-Scarper Api

#### hosted api urls:

https://uninterested-teal-twill.cyclic.app  <br/>
https://olet.onrender.com


### How to request data?

**https://uninterested-teal-twill.cyclic.app/{grade}/{subject}**


Example<br/>

```js
const getData  = async()=>{

const res = await fetch('https://uninterested-teal-twill.cyclic.app/10/sinhala-language')
const data = await res.json()

console.log(data)

}
```

