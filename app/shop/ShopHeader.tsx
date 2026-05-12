
import { ArrowLeft } from "lucide-react";
import Link from "next/link"



const ShopHeader=({title}:{title:string})=>{
    return (
        <div className="flex justify-between items-center mb-4">
        <Link href="/shop" passHref>
          <div
            className="flex items-center text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to shop 
          </div>
        </Link>
        <h2 className="text-2xl font-bold text-white pr-2"> {title}</h2>
      </div>
    )
}


export default ShopHeader;