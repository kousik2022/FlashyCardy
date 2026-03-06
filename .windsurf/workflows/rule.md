---
description: Generate structured flashcard data using Vercel AI library
---

# Flashcard Generation Rule

This project uses the Vercel AI npm library to call OpenAI for AI features, specifically the AI flashcard generation feature.

## Structured Data Generation Pattern

Use the following code pattern to generate an array of flashcards with front and back properties:

```javascript
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output } = await generateText({
  model: "openai/gpt-4-turbo-preview",
  output: Output.object({
    schema: z.object({
      flashcards: z.array(
        z.object({
          front: z.string().describe("The question or prompt on the front of the card"),
          back: z.string().describe("The answer or explanation on the back of the card")
        })
      ),
    }),
  }),
  prompt: `Generate ${numberOfCards} flashcards about ${topic}. Each flashcard should have a clear question on the front and a comprehensive answer on the back.`,
});
```

## Key Points

- **Model**: Use `openai/gpt-4-turbo-preview` or appropriate OpenAI model
- **Schema**: Define an array of flashcard objects with `front` and `back` string properties
- **Dynamic Count**: Replace `${numberOfCards}` with the desired number of flashcards
- **Topic Parameter**: Replace `${topic}` with the subject matter for the flashcards
- **Validation**: Zod schema ensures structured output validation

## Usage Example

```javascript
const result = await generateFlashcards(10, "JavaScript fundamentals");
// Returns: { flashcards: [{ front: "...", back: "..." }, ...] }
```