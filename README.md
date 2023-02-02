### Pastpaperslk Web-Scarper Api

#### hosted api urls:

https://uninterested-teal-twill.cyclic.app  <br/>
https://olet.onrender.com
<br/><br/><br/>

### How to request data?
<br/>
There are two urls you can see above...For requesting data i recommend using https://uninterested-teal-twill.cyclic.app/.<br/> When requesting data replace {grade} with your grade. *Don't use one number like 9 use 09 instead. *

<br/>

**https://uninterested-teal-twill.cyclic.app/{grade}/{subject}**

<br/>

**Important**

<br/>

❌ `https://uninterested-teal-twill.cyclic.app/9/sinhala-language`<br/>
✔️ `https://uninterested-teal-twill.cyclic.app/09/sinhala-language`


<br/>

Example<br/>


```js
const getData  = async()=>{

const res = await fetch('https://uninterested-teal-twill.cyclic.app/10/sinhala-language')
const data = await res.json()

console.log(data)

}
```

<br/>

<br/>

### If you are facing an error feel free to contact me.
Email: codercove@gmail.com

<br/>

<br/>
&copy; 2023 Sithika. All rights reserved.
 

