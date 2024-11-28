import { Controller, Get, Param, Put, Delete, Body } from '@nestjs/common';
import { DeckCompletoService } from './deckcompleto.service';
import { DeckDocument } from './deck.schema';
// import { AuthGuard } from 'src/auth/auth.guard';
// import { Roles } from 'src/auth/roles/decorators/roles.decorator';
// import { RolesGuard } from 'src/auth/roles/roles.guard';
// import { Role } from 'src/auth/roles/enums/roles.enum';

@Controller('deckcompleto')
export class DeckCompletoController {
    constructor(private readonly deckCompletoService: DeckCompletoService) {}

    @Get()
    async getAllDecks(): Promise<DeckDocument[]> {
        return this.deckCompletoService.getAllDecks();
    }

    @Get(':name')
    async getDeckByName(@Param('name') name: string): Promise<DeckDocument> {
        return this.deckCompletoService.getDeckByName(name);
    }
    
    @Get('commander/:name')
    async getCommanderAndDeck(@Param('name') name: string) {
        return this.deckCompletoService.getCommanderAndDeck(name);
    }

    @Put(':name')
    async updateDeckByName(@Param('name') name: string, @Body() updateData: Partial<DeckDocument>): Promise<DeckDocument> {
        return this.deckCompletoService.updateDeckByName(name, updateData);
    }

    @Delete(':name')
    async deleteDeckByName(@Param('name') name: string): Promise<void> {
        return this.deckCompletoService.deleteDeckByName(name);
    }

      // @UseGuards(AuthGuard, RolesGuard)
      // @Roles(Role.Admin) 

}
