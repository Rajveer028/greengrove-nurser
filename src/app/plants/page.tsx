import { getPlants } from "@/actions/plant.action";
import InventoryTable from "@/components/InventoryTable";
import { getCurrentUser } from "@/lib/auth";
import React from "react";

async function page() {
  const user = await getCurrentUser();
  const plants = await getPlants();

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {user ? (
          <section className="rounded-2xl bg-white/70 dark:bg-[#152a1e]/70 shadow-xl border border-green-200 dark:border-green-900 backdrop-blur-lg p-8 transition-all">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6">
              🌿 Your Plant Inventory
            </h2>
            <InventoryTable plants={plants} />
          </section>
        ) : (
          <section className="flex flex-col items-center justify-center h-[70vh] text-center">
            <h2 className="text-3xl font-semibold text-green-800 dark:text-green-300 mb-4">
              🌱 Welcome to GreenGrove
            </h2>
            <div className="bg-white/80 dark:bg-[#1a2f24]/70 border border-green-200 dark:border-green-800 shadow-lg p-6 rounded-xl backdrop-blur-md transition-all">
              <p className="text-green-700 dark:text-green-300">
                You are now logged in as Demo User. Explore the enhanced nursery management features!
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default page;
