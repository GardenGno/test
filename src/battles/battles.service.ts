import { Injectable } from '@nestjs/common';
import { CatsService } from '../cats/cats.service';
import { CatProfile } from '../cats/cats.types';

export interface BattleRequest {
  challengerId: string;
  opponentId: string;
  captureOnWin?: boolean;
}

export interface BattleResult {
  challenger: CatProfile;
  opponent: CatProfile;
  winner: CatProfile;
  loser: CatProfile;
  score: {
    challenger: number;
    opponent: number;
  };
  capture?: {
    capturedCatId: string;
    owner: string;
  };
}

@Injectable()
export class BattlesService {
  constructor(private readonly catsService: CatsService) {}

  resolveBattle(request: BattleRequest, trainer: string): BattleResult {
    const challenger = this.catsService.findOne(request.challengerId);
    const opponent = this.catsService.findOne(request.opponentId);

    const challengerScore = this.calculateScore(challenger);
    const opponentScore = this.calculateScore(opponent);

    const winner = challengerScore >= opponentScore ? challenger : opponent;
    const loser = winner.id === challenger.id ? opponent : challenger;

    const result: BattleResult = {
      challenger,
      opponent,
      winner,
      loser,
      score: {
        challenger: challengerScore,
        opponent: opponentScore,
      },
    };

    if (request.captureOnWin && winner.id === challenger.id) {
      this.catsService.capture(loser.id, trainer);
      result.capture = {
        capturedCatId: loser.id,
        owner: trainer,
      };
    }

    return result;
  }

  private calculateScore(cat: CatProfile): number {
    const { strength, agility, intelligence, perception, luck } = cat.stats;
    const base = strength + agility + intelligence + perception;
    const luckBonus = Math.floor(Math.random() * (luck + 1));
    return base + luckBonus;
  }
}
