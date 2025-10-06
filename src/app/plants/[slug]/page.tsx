import React from "react";
import PlantCard from "./PlantCard";
import { getPlantById } from "@/actions/plant.action";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  // Extract the id from the slug by splitting on the delimiter
  const [id] = params.slug.split("--");
  const plant = await getPlantById(id);
  return {
    title: plant ? plant.name : "Plant Details",
    description: plant ? plant.description : "Plant details page",
  };
}

async function page({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  const [id] = params.slug.split("--");
  const plant = await getPlantById(id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Access Required</h2>
          <p className="text-green-600">Please sign in to view plant details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-full">
        <PlantCard plant={plant} />
      </div>
    </div>
  );
}

export default page;
