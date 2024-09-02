import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Vlink {
  id: number;
  vlink: string;
  timestamp: string;
  vid: string;
}

export default function Bin() {
  const [vlinks, setVlinks] = useState<Vlink[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVlinks = async () => {
      try {
        const res = await fetch('/api/vlinks');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setVlinks(data);
        } else {
          console.error('Expected an array but got:', data);
        }
      } catch (error) {
        console.error('Error fetching vlinks:', error);
      }
    };

    fetchVlinks();
  }, []);

  const removeVlink = async (id: number) => {
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }
  
    try {
      const res = await fetch(`/api/vlinks/${id}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        setVlinks(vlinks.filter(vlink => vlink.id !== id));
        router.push('/bin');  // Refreshes the bin page after deletion
      } else {
        console.error('Failed to delete vlink');
      }
    } catch (error) {
      console.error('Error deleting vlink:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Uploaded Video Links</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Video Link</th>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">VID</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vlinks.map((vlink) => (
            <tr key={vlink.id} className="border-t">
              <td className="px-4 py-2">{vlink.id}</td>
              <td className="px-4 py-2">
                <a 
                  href={vlink.vlink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline" 
                  title={vlink.vlink}
                >
                  <span className="truncate w-48 inline-block">{vlink.vlink}</span>
                </a>
              </td>
              <td className="px-4 py-2">{new Date(vlink.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2">
                <a 
                  href={`/v/${vlink.vid}`} 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline" 
                  title={vlink.vid}
                >
                  {vlink.vid}
                </a>
              </td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => removeVlink(vlink.id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <Link href="/">Go Home</Link>
    </div>
  );
}
