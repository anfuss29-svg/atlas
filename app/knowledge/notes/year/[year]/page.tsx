import Link from "next/link";

export default async function YearPage({
  params,
}:{
  params:Promise<{
    year:string;
  }>
}){

const {year}=await params;

return(

<div>

<h1 className="mb-8 text-5xl font-black">
Year {year}
</h1>

<div className="grid gap-6 md:grid-cols-2">

<Link
href={`/knowledge/notes/year/${year}/semester/1`}
className="rounded-3xl bg-[#111827] p-8"
>
Semester 1
</Link>

<Link
href={`/knowledge/notes/year/${year}/semester/2`}
className="rounded-3xl bg-[#111827] p-8"
>
Semester 2
</Link>

</div>

</div>

);

}