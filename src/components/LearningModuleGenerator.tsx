import { invokeLLM } from '@/integrations/core';
import { Content } from '@/entities';

interface LearningTechnique {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export class LearningModuleGenerator {
  static async generatePersonalizedModule(contentId: string, technique: LearningTechnique) {
    try {
      // Get the content data
      const content = await Content.get(contentId);
      
      if (!content || content.processing_status !== 'completed') {
        throw new Error('Content not ready for module generation');
      }

      // Generate technique-specific learning module
      const modulePrompt = this.getTechniquePrompt(technique, content);
      
      const moduleResult = await invokeLLM({
        prompt: modulePrompt,
        response_json_schema: {
          type: "object",
          properties: {
            module_title: { type: "string" },
            learning_objectives: {
              type: "array",
              items: { type: "string" }
            },
            content_sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  duration_minutes: { type: "number" },
                  difficulty: { type: "string" }
                }
              }
            },
            interactive_elements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                  timing: { type: "string" }
                }
              }
            },
            assessment_questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  },
                  correct_answer: { type: "string" },
                  explanation: { type: "string" }
                }
              }
            },
            personalization_notes: { type: "string" }
          }
        }
      });

      // Save the generated module
      const updatedModules = [...(content.learning_modules || []), {
        technique: technique.id,
        module_data: moduleResult,
        generated_at: new Date().toISOString()
      }];

      await Content.update(contentId, {
        learning_modules: updatedModules
      });

      return moduleResult;
    } catch (error) {
      console.error('Error generating learning module:', error);
      return this.getFallbackModule(technique);
    }
  }

  private static getTechniquePrompt(technique: LearningTechnique, content: any): string {
    const basePrompt = `Create a personalized learning module using the "${technique.title}" technique for the following content:

Title: ${content.title}
Summary: ${content.processed_summary}
Key Concepts: ${content.key_concepts.join(', ')}

Technique Description: ${technique.description}
Technique Features: ${technique.features.join(', ')}`;

    switch (technique.id) {
      case 'spaced-repetition':
        return `${basePrompt}

Create a spaced repetition learning module with:
- Progressive difficulty levels
- Optimal review intervals (1 day, 3 days, 1 week, 2 weeks, 1 month)
- Confidence-based scheduling
- Memory consolidation checkpoints
- Adaptive content based on retention rates`;

      case 'passive-audio':
        return `${basePrompt}

Create a passive audio learning module with:
- Audio-optimized content structure
- Background learning segments
- Repetitive key concept reinforcement
- Subliminal learning cues
- Optimal audio pacing and rhythm`;

      case 'binaural-beats':
        return `${basePrompt}

Create a binaural beats enhanced learning module with:
- Frequency-specific content sections (Alpha: 8-13Hz for focus, Beta: 13-30Hz for active learning)
- Brainwave entrainment timing
- Cognitive enhancement periods
- Relaxation and focus transitions
- Synchronized learning activities`;

      case 'micro-quiz':
        return `${basePrompt}

Create a micro-quiz learning module with:
- Bite-sized knowledge chunks (30-60 seconds each)
- Contextual question timing
- Progressive difficulty
- Immediate feedback loops
- Spaced notification scheduling`;

      case 'memory-palace':
        return `${basePrompt}

Create a 3D memory palace learning module with:
- Spatial memory anchors
- Visual association techniques
- Virtual environment navigation
- Location-based concept mapping
- Immersive memory techniques`;

      case 'ar-labeling':
        return `${basePrompt}

Create an AR labeling learning module with:
- Real-world integration points
- Visual overlay instructions
- Interactive label placement
- Contextual learning triggers
- Augmented reality experiences`;

      case 'sleep-reinforcement':
        return `${basePrompt}

Create a sleep reinforcement learning module with:
- Sleep cycle optimization
- Gentle audio cues for different sleep stages
- Memory consolidation techniques
- Subconscious learning protocols
- Dream integration methods`;

      case 'neuroadaptive':
        return `${basePrompt}

Create a neuroadaptive learning module with:
- Performance-based difficulty adjustment
- Real-time adaptation algorithms
- Cognitive load optimization
- Personalized learning paths
- Dynamic content modification`;

      case 'contextual-triggers':
        return `${basePrompt}

Create a contextual triggers learning module with:
- Location-based learning cues
- Time-sensitive content delivery
- Environmental trigger points
- Context-aware notifications
- Situational learning optimization`;

      case 'ai-dream-prompts':
        return `${basePrompt}

Create an AI dream prompts learning module with:
- Subconscious learning integration
- Dream influence techniques
- Sleep learning protocols
- Unconscious processing methods
- Dream-based memory consolidation`;

      case 'haptic-flashcards':
        return `${basePrompt}

Create a haptic flashcards learning module with:
- Tactile feedback patterns
- Touch-based memory reinforcement
- Multi-sensory learning integration
- Muscle memory techniques
- Haptic interaction design`;

      default:
        return `${basePrompt}

Create a comprehensive learning module that incorporates the unique aspects of this technique.`;
    }
  }

  private static getFallbackModule(technique: LearningTechnique) {
    return {
      module_title: `${technique.title} Learning Module`,
      learning_objectives: [
        "Master key concepts through personalized learning",
        "Apply technique-specific learning strategies",
        "Achieve optimal knowledge retention"
      ],
      content_sections: [
        {
          title: "Introduction",
          content: `Welcome to your personalized ${technique.title} learning experience.`,
          duration_minutes: 5,
          difficulty: "Beginner"
        },
        {
          title: "Core Concepts",
          content: "Explore the fundamental concepts using advanced learning techniques.",
          duration_minutes: 15,
          difficulty: "Intermediate"
        },
        {
          title: "Advanced Application",
          content: "Apply your knowledge in complex scenarios.",
          duration_minutes: 10,
          difficulty: "Advanced"
        }
      ],
      interactive_elements: [
        {
          type: "Quiz",
          description: "Interactive knowledge check",
          timing: "After each section"
        },
        {
          type: "Practice",
          description: "Hands-on application",
          timing: "End of module"
        }
      ],
      assessment_questions: [
        {
          question: "What is the main benefit of this learning technique?",
          options: ["Speed", "Retention", "Convenience", "All of the above"],
          correct_answer: "All of the above",
          explanation: "This technique combines multiple benefits for optimal learning."
        }
      ],
      personalization_notes: `This module has been customized for the ${technique.title} technique to maximize your learning potential.`
    };
  }
}