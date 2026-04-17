import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { SnippetType } from '../snippet.schema.js';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(SnippetType)
  type: SnippetType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
