'use client';

import CustomChart from "@/components/custom/chart";

export default function Dashboard() {

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="flex flex-1 flex-col w-1/2">
                  <h1>Charts</h1>
                  <CustomChart />
              </div>
      </div>
    );
}