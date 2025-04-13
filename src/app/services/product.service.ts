import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private products: Product[] = [
    {
      id: '1',
      name: 'Modern művészet',
      description: 'Nagyon művészi. Nem pénzmosásra használják.',
      price: 2999999,
      imageUrl: '/assets/modernart.jpg',
      category: 'wall-decor',
      stock: 10,
      rating: 4.5,
      dimensions: {
        width: 60,
        height: 40,
        depth: 2
      },
      material: 'Papír',
      color: 'Többszínű',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Dekoratív párna',
      description: 'Nem kényelmes, de nagyon szép dekoráció.',
      price: 12990,
      imageUrl: '/assets/pillows.jpg',
      category: 'soft-furnishings',
      stock: 15,
      rating: 4.8,
      dimensions: {
        width: 45,
        height: 45,
        depth: 10
      },
      material: 'Pamut',
      color: 'Szürke',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Egzotikus váza',
      description: 'Nepáli hegyvíz inspirált váza. Dániában gyártották.',
      price: 8990,
      imageUrl: '/assets/vase.jpg',
      category: 'home-accents',
      stock: 25,
      rating: 4.6,
      dimensions: {
        width: 15,
        height: 25,
        depth: 15
      },
      material: 'Kerámia',
      color: 'Fehér',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Könyvespolc',
      description: 'Elég sok könyv tárolására alkalmas.',
      price: 45990,
      imageUrl: '/assets/bookshelf.jpg',
      category: 'storage',
      stock: 8,
      rating: 4.7,
      dimensions: {
        width: 80,
        height: 120,
        depth: 30
      },
      material: 'Fém',
      color: 'Fekete',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Festmény',
      description: 'Nagyon szép festmény. Ezt sem pénzmosásra használják.',
      price: 149990,
      imageUrl: '/assets/painting.jpg',
      category: 'wall-decor',
      stock: 12,
      rating: 4.9,
      dimensions: {
        width: 50,
        height: 70,
        depth: 1
      },
      material: 'Pamut kötél',
      color: 'Krém',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Minimalista Lámpa',
      description: 'Nagyon sok színben világító LEDek vannak benne.',
      price: 18990,
      imageUrl: '/assets/lamp.jpg',
      category: 'office',
      stock: 20,
      rating: 4.6,
      dimensions: {
        width: 12,
        height: 35,
        depth: 12
      },
      material: 'Alumínium',
      color: 'Ezüst',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      name: 'Puha szőnyeg',
      description: 'Nagyon puha szőnyeg. Könnyen tisztítható. Kutyabarát. Macskákat gyűlöli',
      price: 24990,
      imageUrl: '/assets/rug.jpg',
      category: 'soft-furnishings',
      stock: 7,
      rating: 4.3,
      dimensions: {
        width: 160,
        height: 230,
        depth: 3
      },
      material: 'Poliészter',
      color: 'Bézs',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8',
      name: 'Fenyő ágykeret',
      description: 'Erős fenyő ágykeret. Minimalista dizájn. Sok mindent elbír',
      price: 129990,
      imageUrl: '/assets/bed.jpg',
      category: 'bedroom',
      stock: 4,
      rating: 4.9,
      dimensions: {
        width: 160,
        height: 40,
        depth: 200
      },
      material: 'Tölgyfa',
      color: 'Természetes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      name: 'Kávés asztal',
      description: 'Ez egy asztal ami különösen alkalmas kávéfogyasztásra.',
      price: 69990,
      imageUrl: '/assets/coffee_table.jpg',
      category: 'living-room',
      stock: 6,
      rating: 4.7,
      dimensions: {
        width: 100,
        height: 45,
        depth: 60
      },
      material: 'Márvány, Fém',
      color: 'Fehér, Arany',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      name: 'Ebédlőkészlet',
      description: 'Türkmenisztánból importált kerámiaebédlőkészlet.',
      price: 35990,
      imageUrl: '/assets/dinner.jpg',
      category: 'kitchen',
      stock: 10,
      rating: 4.5,
      dimensions: {
        width: 30,
        height: 30,
        depth: 30
      },
      material: 'Kerámia',
      color: 'Fehér',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '11',
      name: 'Fürdőszoba szekrény',
      description: 'Kényelmesen tárolható benne sok minden.',
      price: 15990,
      imageUrl: '/assets/bathroom_shelf.jpg',
      category: 'bathroom',
      stock: 15,
      rating: 4.3,
      dimensions: {
        width: 40,
        height: 100,
        depth: 25
      },
      material: 'Bambusz',
      color: 'Természetes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      name: 'Kényelmetlen napágy',
      description: 'Kényelmetlen napágy. Nem kényelmes, de ikonikus.',
      price: 18990,
      imageUrl: '/assets/sun.jpg',
      category: 'outdoor',
      stock: 3,
      rating: 4.8,
      dimensions: {
        width: 200,
        height: 80,
        depth: 200
      },
      material: 'Műanyag',
      color: 'Szürke',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    if (!category || category === 'all') {
      return this.getProducts();
    }
    
    const filteredProducts = this.products.filter(p => p.category === category);
    return of(filteredProducts);
  }
} 