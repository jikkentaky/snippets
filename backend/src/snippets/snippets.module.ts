import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Snippet, SnippetSchema } from './snippet.schema.js';
import { SnippetsService } from './snippets.service.js';
import { SnippetsController } from './snippets.controller.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Snippet.name, schema: SnippetSchema }])],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule {}
