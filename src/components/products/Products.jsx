import React, { useEffect, useState } from 'react'
const API_URL = "http://localhost:4000/products"
import './Products.css'
function Products() {
    const [data, setData] = useState(null)
    const [reload, setReload] = useState(true)
    const [edit, setEdit] = useState(null)
    useEffect(()=> {
      fetch(API_URL)
        .then(res => res.json())
        .then(res => setData(res))
    }, [reload])

    const handleCreateProduct = e => {
        e.preventDefault()
        let formData = new FormData(e.target)
        let products = Object.fromEntries(formData.entries())
        console.log(products)

        fetch(API_URL, {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(products)
        })
        .then(res => {
            setReload(p => !p)
            e.target.reset()
        })
    }

    const handleDeleteProduct = id => {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            setReload(p => !p)
        })
    }

    const handleUpdateProduct = () => {
        fetch(`${API_URL}/${edit.id}`, {
            method: "Put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(edit)
        })
        .then(res => {
            setReload(p => !p)
            setEdit(null)
        })
    }
  return (
    <div className='products'>
        <form onSubmit={handleCreateProduct} action="">
            <input placeholder='Title' type="text" name='title' />
            <input placeholder='Price' type="number" name='price' />
            <input placeholder='Category' type="text" name='category' />
            <button>Create</button>
        </form>
      <div className='products__items'>
        {
            data?.map(products =>(
                <div key={products.id}>
                    <h4>{products.title}</h4>
                    <p>${products.price}</p>
                    <p>By {products.category}</p>
                    <button onClick={() => {handleDeleteProduct(products.id)}}>Delete</button>
                    <button onClick={()=> setEdit(products)}>Edit</button>
                </div>
            ))
        }
      </div>
      {
            edit?
        <div className='edit'>
            <input type="text" value={edit.title} onChange={(e) => setEdit( prev =>({...prev, title: e.target.value}))}/>
            <input type="text" value={edit.price} onChange={(e) => setEdit( prev =>({...prev, price: e.target.value}))}/>
            <input type="text" value={edit.category} onChange={(e) => setEdit( prev =>({...prev, category: e.target.value}))}/>

            <button onClick={handleUpdateProduct}>Save</button>
        </div>
        : <></>
       } 
    </div>
  )
}

export default Products
