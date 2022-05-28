import React, { useState } from "react";
import {client, urlFor} from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Product } from '../../components'

const ProductDetails = ({ product, products }) => {
    const { image, name, details, price } = product;
    const [index, setIndex] = useState(0);
    return (
        <div>
            <div className="product-detail-container">
                <div className="image-container">
                    <img
                        src={urlFor(image && image[index])}
                        className="product-detail-image" />
                </div>
                <div className="small-images-container">
                    {image?.map((item, i) => (
                        <img
                            width="100"
                            height="100"
                            src={urlFor(item)}
                            className={i === index ? 
                                'small-image selected-image' :
                                'small-image'}
                            onMouseEnter={() => setIndex(i)}
                        />
                    ))}
                </div>
                <div className="product-detail-desc">
                    <h2>{name}</h2>
                    <div className="reviews">
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                    </div>
                    <p className="review-count">
                        (20)
                    </p>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className="price">${price}</p>
                    <div className="quanity">
                        <h4>Quantity:</h4>
                        <p className="quantity-desc">
                            <span className="minus" onClick="">
                                <AiOutlineMinus />
                            </span>
                            <span className="num" onClick="">
                                0
                            </span>
                            <span className="plus" onClick="">
                                <AiOutlinePlus />
                            </span>
                        </p>
                        <div className="buttons">
                            <button
                                type="button"
                                className="add-to-cart"
                                onClick="">
                                    Add to Cart
                            </button>
                            <button
                                type="button"
                                className="buy-now"
                                onClick="">
                                    Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="maylike-products-wrapper">
                    <h2>You may also like</h2>
                    <div className="marquee">
                        <div className="maylike-products-container track">
                            {products.map(item => 
                                <Product key={item._id} product={item} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map(product => ({
        params: {
            slug: product.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]';
    
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery)
  
    return {
      props: { products, product }
    }
  }

export default ProductDetails;