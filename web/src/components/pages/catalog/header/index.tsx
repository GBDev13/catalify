import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { FiChevronDown, FiSearch, FiShoppingBag } from "react-icons/fi"
import { Popover } from "src/components/ui/Popover"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalogCategories } from "src/services/catalog"
import { useCatalog } from "src/store/catalog"

const CategoriesList = () => {
  const { slug } = useCatalog(s => s.info);

  const { data: categories } = useQuery(catalogKeys.companyCategories(slug), () => getCompanyCatalogCategories(slug), {
    enabled: !!slug,
  });

  return (
    <div className="min-w-[170px] flex flex-col gap-2">
      {categories?.map(category => (
        <Link key={category.slug} href={`/${slug}/categorias/${category.slug}`} className="text-gray-500 hover:text-primary transition-colors">{category.name}</Link>
      ))}
    </div>
  )
}

export const Header = () => {
  const { logo, slug, name } = useCatalog(s => s.info);

  const { data: categories } = useQuery(catalogKeys.companyCategories(slug), () => getCompanyCatalogCategories(slug), {
    enabled: !!slug,
  });

  return (
    <header className="w-full flex items-center justify-between py-8 flex-col sm:flex-row">
      <div className="flex items-center justify-between w-full">
        <Link href={`/${slug}`}>
          {logo ? <img className="w-[170px]" src={logo} /> : <h1 className="text-2xl font-bold text-primary">{name}</h1>}
        </Link>

        <nav className="mr-auto items-center gap-4 hidden lg:gap-6 ml-4 lg:ml-10 sm:flex">
          <Link href={`/${slug}/produtos`} className="text-gray-500 hover:text-primary transition-colors">Produtos</Link>
          {categories?.length && (
            <Popover className="!bg-white shadow-lg border border-gray-200" content={<CategoriesList />}>
              <button className="text-gray-500 flex items-center gap-2 group hover:text-primary transition-colors">Categorias <FiChevronDown className="group-data-[state='open']:rotate-180 transition-all" /></button>
            </Popover>
          )}
        </nav>


        <button className="sm:hidden w-10 h-10 rounded-full bg-primary text-readable flex items-center justify-center hover:brightness-105 transition-all">
          <FiShoppingBag size={20} />
        </button>
      </div>

      <nav className="items-center gap-4 flex lg:gap-6 mx-auto my-4 sm:hidden">
        <Link href="/produtos" className="text-gray-500 hover:text-primary transition-colors">Produtos</Link>
        <Popover className="!bg-white shadow-lg border border-gray-200" content={<CategoriesList />}>
          <button className="text-gray-500 flex items-center gap-2 group hover:text-primary transition-colors">Categorias <FiChevronDown className="group-data-[state='open']:rotate-180 transition-all" /></button>
        </Popover>
      </nav>

      <section className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-full">
          <input placeholder="Pesquisar..." className="focus:outline-none h-9 pl-4 pr-10 text-sm placeholder:text-gray-400 w-full sm:w-[250px] rounded-full border border-primary" />
          <FiSearch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary transition-all cursor-pointer" />
        </div>

        <button className="min-w-[40px] h-10 rounded-full bg-primary text-readable hidden sm:flex items-center justify-center hover:brightness-105 transition-all">
          <FiShoppingBag size={20} />
        </button>
      </section>
    </header>
  )
}