import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CatProfile, CreateCatDto, UpdateCatDto } from './cats.types';

@Injectable()
export class CatsService {
  private cats: CatProfile[] = [
    {
      id: 'cat-neo-01',
      name: 'Нео',
      breed: 'Британская короткошёрстная',
      description: 'Стратег с лазерным взглядом и тактическим мурчанием.',
      imageUrl:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
      stats: {
        strength: 7,
        agility: 6,
        intelligence: 9,
        perception: 8,
        luck: 5,
      },
    },
    {
      id: 'cat-luna-02',
      name: 'Луна',
      breed: 'Мейн-кун',
      description: 'Охотница за дронами и защитница кибер-территории.',
      imageUrl:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
      stats: {
        strength: 8,
        agility: 7,
        intelligence: 6,
        perception: 7,
        luck: 6,
      },
    },
  ];

  findAll(): CatProfile[] {
    return this.cats;
  }

  findOne(id: string): CatProfile {
    const cat = this.cats.find((entry) => entry.id === id);
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  create(payload: CreateCatDto): CatProfile {
    const cat: CatProfile = {
      id: randomUUID(),
      ...payload,
    };
    this.cats = [cat, ...this.cats];
    return cat;
  }

  update(id: string, payload: UpdateCatDto): CatProfile {
    const cat = this.findOne(id);
    Object.assign(cat, payload);
    return cat;
  }

  capture(id: string, owner: string): CatProfile {
    const cat = this.findOne(id);
    cat.owner = owner;
    return cat;
  }
}
