import clsx from "clsx"
import { ProductItem } from "./product-item"

type ProductsListProps = {
  title: string
  products: Products.CatalogProduct[]
}

export const ProductsList = ({ products, title }: ProductsListProps) => {
  return (
    <section>
      <h3 className="text-3xl font-semibold text-primary my-10 text-center">{title}</h3>

      <div className={clsx("grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] text-center", {
        "grid-cols-1 lg:grid-cols-2": products.length === 1,
      })}>
        {products.map(product => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </section>
  )
}