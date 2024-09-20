// 'use client'
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button"

// export default function DataCollectionPage() {const [isLoading, setIsLoading] = useState(false);
//   const [titles, setTitles] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const handleCollectData = async () => {
//     setIsLoading(true);
//     setTitles([]);
//     setError(null);

//     try {
//       const response = await fetch('/api/jamaica/fetchSupremeCourtData');
//       const data = await response.json();

//       if (response.ok) {
//         setTitles(data.titles);
//       } else {
//         throw new Error(data.error || 'Failed to fetch data');
//       }
//     } catch (err) {
//       setError('Failed to collect data. See console for details.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Supreme Court Case Titles</h1>
//       <Button
//         onClick={handleCollectData}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Collecting...' : 'Collect Titles'}
//       </Button>
//       {error && <p className="mt-4 text-red-600">{error}</p>}
//       {titles.length > 0 && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold mb-2">Collected Titles:</h2>
//           <ul className="list-disc pl-5">
//             {titles.map((title, index) => (
//               <li key={index} className="mb-2">{title}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
