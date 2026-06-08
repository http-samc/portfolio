import React from 'react'
import Image from 'next/image'

interface GarageProps {
  vehicles: {
    name: string;
    img: string;
  }[];
}

const Garage = ({ vehicles }: GarageProps) => {
  return (
    <div className="grid sm:grid-cols-3 gap-4 px-3 pt-3">
      {vehicles.map((vehicle) => (
        <div key={vehicle.name} className="relative w-full h-64 overflow-hidden rounded-lg group/vehicle border">
          <Image src={vehicle.img} alt={vehicle.name} fill className="object-cover sm:grayscale group-hover/vehicle:grayscale-0 transition-all" />
          <div className="absolute inset-0 bg-black/0 flex items-end justify-start pb-2">
            <p className="text-white line-clamp-1 text-sm font-semibold">{vehicle.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Garage