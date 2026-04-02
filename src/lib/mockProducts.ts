// Mock product data - This will be replaced with Supabase data
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  gender: string;
  isClearance?: boolean;
  team?: string;
  description?: string;
}

export const mockProducts: Product[] = [
  // T-Shirts
  {
    id: '1',
    name: 'Scuderia Ferrari 2025 Drivers Oversized T-Shirt - Red',
    price: 40.00,
    originalPrice: 81.00,
    image: 'https://images.unsplash.com/photo-1763558134668-e185bbab7aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMHJhY2luZyUyMHJlZCUyMHQtc2hpcnR8ZW58MXx8fHwxNzY3NzgyNTExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'T-Shirts',
    gender: 'men',
    isClearance: true,
    team: 'Ferrari',
    description: 'Official Ferrari racing team t-shirt'
  },
  {
    id: '2',
    name: 'Mercedes AMG Petronas Team T-Shirt - Black',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1763558134668-e185bbab7aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMHJhY2luZyUyMHJlZCUyMHQtc2hpcnR8ZW58MXx8fHwxNzY3NzgyNTExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'T-Shirts',
    gender: 'men',
    team: 'Mercedes',
    description: 'Mercedes F1 team official merchandise'
  },
  {
    id: '3',
    name: 'Red Bull Racing Team T-Shirt - Navy',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1763558134668-e185bbab7aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMHJhY2luZyUyMHJlZCUyMHQtc2hpcnR8ZW58MXx8fHwxNzY3NzgyNTExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'T-Shirts',
    gender: 'women',
    team: 'Red Bull',
    description: 'Red Bull Racing official t-shirt'
  },
  
  // Caps & Hats
  {
    id: '4',
    name: 'Scuderia Ferrari 2025 Team Charles Leclerc Cap - White',
    price: 24.00,
    originalPrice: 41.00,
    image: 'https://images.unsplash.com/photo-1752348512163-68e894f22046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXAlMjBoYXR8ZW58MXx8fHwxNzY3NzgyNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Caps & Hats',
    gender: 'all',
    isClearance: true,
    team: 'Ferrari',
    description: 'Charles Leclerc signature cap'
  },
  {
    id: '5',
    name: 'Scuderia Ferrari 2025 Team Charles Leclerc Cap - Red - Kids',
    price: 18.00,
    originalPrice: 36.00,
    image: 'https://images.unsplash.com/photo-1752348512163-68e894f22046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXAlMjBoYXR8ZW58MXx8fHwxNzY3NzgyNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Caps & Hats',
    gender: 'kids',
    isClearance: true,
    team: 'Ferrari',
    description: 'Kids Ferrari racing cap'
  },
  {
    id: '6',
    name: 'McLaren Racing Team Cap - Orange',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1752348512163-68e894f22046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXAlMjBoYXR8ZW58MXx8fHwxNzY3NzgyNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Caps & Hats',
    gender: 'all',
    team: 'McLaren',
    description: 'McLaren F1 team cap'
  },

  // Hoodies
  {
    id: '7',
    name: 'Mercedes AMG Petronas Team Hoodie - Black',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1614214191247-5b2d3a734f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3Njc2ODI3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Hoodies & Sweatshirts',
    gender: 'men',
    team: 'Mercedes',
    description: 'Official Mercedes F1 team hoodie'
  },
  {
    id: '8',
    name: 'Red Bull Racing Hoodie - Navy',
    price: 72.00,
    originalPrice: 90.00,
    image: 'https://images.unsplash.com/photo-1614214191247-5b2d3a734f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3Njc2ODI3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Hoodies & Sweatshirts',
    gender: 'women',
    isClearance: true,
    team: 'Red Bull',
    description: 'Red Bull Racing official hoodie'
  },
  {
    id: '9',
    name: 'Ferrari Team Hoodie - Red',
    price: 78.00,
    image: 'https://images.unsplash.com/photo-1614214191247-5b2d3a734f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3Njc2ODI3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Hoodies & Sweatshirts',
    gender: 'kids',
    team: 'Ferrari',
    description: 'Ferrari team hoodie for kids'
  },

  // Model Cars
  {
    id: '10',
    name: 'Ferrari SF-23 1:18 Scale Model Car',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1752896596098-4f679e66ba15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMG1vZGVsJTIwY2FyfGVufDF8fHx8MTc2Nzc4MjUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Model Cars',
    gender: 'all',
    team: 'Ferrari',
    description: 'Detailed 1:18 scale Ferrari model'
  },
  {
    id: '11',
    name: 'Mercedes W14 1:18 Scale Model Car',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1752896596098-4f679e66ba15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMG1vZGVsJTIwY2FyfGVufDF8fHx8MTc2Nzc4MjUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Model Cars',
    gender: 'all',
    team: 'Mercedes',
    description: 'Mercedes championship car model'
  },
  {
    id: '12',
    name: 'Red Bull RB19 1:43 Scale Model Car',
    price: 45.00,
    originalPrice: 65.00,
    image: 'https://images.unsplash.com/photo-1752896596098-4f679e66ba15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMG1vZGVsJTIwY2FyfGVufDF8fHx8MTc2Nzc4MjUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Model Cars',
    gender: 'all',
    isClearance: true,
    team: 'Red Bull',
    description: 'Red Bull championship car model'
  },

  // Pants
  {
    id: '13',
    name: 'Mercedes AMG Track Pants - Black',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1765568562615-4bf854edcf1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBwYW50cyUyMHNwb3J0c3dlYXJ8ZW58MXx8fHwxNzY3NzgyNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Pants',
    gender: 'men',
    team: 'Mercedes',
    description: 'Mercedes racing track pants'
  },
  {
    id: '14',
    name: 'Ferrari Team Track Pants - Red',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1765568562615-4bf854edcf1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBwYW50cyUyMHNwb3J0c3dlYXJ8ZW58MXx8fHwxNzY3NzgyNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Pants',
    gender: 'women',
    team: 'Ferrari',
    description: 'Ferrari team racing pants'
  },

  // Accessories
  {
    id: '15',
    name: 'F1 Racing Sunglasses - Black',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1765146488719-c33cdd056b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBzdW5nbGFzc2VzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzY3NzgyNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accessories',
    gender: 'all',
    description: 'Official F1 racing sunglasses'
  },
  {
    id: '16',
    name: 'Ferrari Racing Keychain',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1765146488719-c33cdd056b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBzdW5nbGFzc2VzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzY3NzgyNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accessories',
    gender: 'all',
    team: 'Ferrari',
    description: 'Ferrari team keychain'
  },
  {
    id: '17',
    name: 'Red Bull Racing Water Bottle',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1765146488719-c33cdd056b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBzdW5nbGFzc2VzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzY3NzgyNTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accessories',
    gender: 'all',
    team: 'Red Bull',
    description: 'Red Bull team water bottle'
  },

  // Collectibles
  {
    id: '18',
    name: 'Lewis Hamilton Signed Photo - Framed',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1752896596098-4f679e66ba15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMG1vZGVsJTIwY2FyfGVufDF8fHx8MTc2Nzc4MjUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Collectibles & Memorabilia',
    gender: 'all',
    team: 'Mercedes',
    description: 'Authentic signed Lewis Hamilton photo'
  },
  {
    id: '19',
    name: 'Ferrari Garage Flag - Official',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1752896596098-4f679e66ba15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtdWxhJTIwMSUyMG1vZGVsJTIwY2FyfGVufDF8fHx8MTc2Nzc4MjUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Collectibles & Memorabilia',
    gender: 'all',
    team: 'Ferrari',
    description: 'Official Ferrari racing flag'
  },
  {
    id: '20',
    name: 'Max Verstappen Championship Hat 2023',
    price: 65.00,
    originalPrice: 85.00,
    image: 'https://images.unsplash.com/photo-1752348512163-68e894f22046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXAlMjBoYXR8ZW58MXx8fHwxNzY3NzgyNTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Collectibles & Memorabilia',
    gender: 'all',
    isClearance: true,
    team: 'Red Bull',
    description: 'Limited edition championship hat'
  },
];
