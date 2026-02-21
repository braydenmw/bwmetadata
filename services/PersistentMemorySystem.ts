import { EventBus } from './EventBus';

export interface MemoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  context: Record<string, unknown>;
  outcome?: Record<string, unknown>;
  lessonsLearned?: string[];
  confidence: number;
}

export interface LiabilityRisk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  proactiveAction?: string;
}

export class PersistentMemorySystem {
  private memory: Map<string, MemoryEntry[]> = new Map();
  private liabilityRisks: LiabilityRisk[] = [];
  private maxMemoryPerCategory = 1000;

  constructor() {
    this.loadFromStorage();
    this.initializeLiabilityProtections();
  }

  // Memory Management
  async remember(category: string, entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<void> {
    const fullEntry: MemoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    if (!this.memory.has(category)) {
      this.memory.set(category, []);
    }

    const categoryMemory = this.memory.get(category)!;
    categoryMemory.push(fullEntry);

    // Keep only recent entries
    if (categoryMemory.length > this.maxMemoryPerCategory) {
      categoryMemory.splice(0, categoryMemory.length - this.maxMemoryPerCategory);
    }

    await this.saveToStorage();
    EventBus.emit({ type: 'memoryUpdated', reportId: category, cases: [{ id: fullEntry.id, score: fullEntry.confidence, why: fullEntry.lessonsLearned || [fullEntry.action] }] });
  }

  recall(category: string, limit = 10): MemoryEntry[] {
    const entries = this.memory.get(category) || [];
    return entries.slice(-limit).reverse(); // Most recent first
  }

  searchMemory(query: string, category?: string): MemoryEntry[] {
    const allEntries: MemoryEntry[] = [];
    const categories = category ? [category] : Array.from(this.memory.keys());

    for (const cat of categories) {
      const entries = this.memory.get(cat) || [];
      allEntries.push(...entries);
    }

    return allEntries
      .filter(entry =>
        entry.action.toLowerCase().includes(query.toLowerCase()) ||
        JSON.stringify(entry.context).toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20);
  }

  // Liability Protection
  assessLiability(action: string, context: Record<string, unknown>): LiabilityRisk[] {
    const risks: LiabilityRisk[] = [];

    // Check against known risk patterns
    for (const risk of this.liabilityRisks) {
      if (this.matchesRiskPattern(risk, action, context)) {
        risks.push(risk);
      }
    }

    return risks;
  }

  private matchesRiskPattern(risk: LiabilityRisk, action: string, context: Record<string, unknown>): boolean {
    // Simple pattern matching - could be enhanced with ML
    const riskKeywords = risk.description.toLowerCase().split(' ');
    const actionLower = action.toLowerCase();
    const contextStr = JSON.stringify(context).toLowerCase();

    return riskKeywords.some(keyword =>
      actionLower.includes(keyword) || contextStr.includes(keyword)
    );
  }

  // Self-Improvement
  async learnFromExperience(entry: MemoryEntry): Promise<void> {
    // Analyze successful vs failed actions
    if (entry.outcome?.success === false) {
      // Learn from failures
      const lessons = await this.extractLessons(entry);
      entry.lessonsLearned = lessons;
      await this.remember('failures', entry);
    } else if (entry.confidence > 0.8) {
      // Learn from high-confidence successes
      await this.remember('successful_patterns', entry);
    }
  }

  private async extractLessons(entry: MemoryEntry): Promise<string[]> {
    // Deterministic lesson extraction from action/context/outcome metadata.
    const lessons = [
      `Avoid ${entry.action} when ${JSON.stringify(entry.context)}`,
      'Implement additional validation before similar actions',
      'Consider alternative approaches for better outcomes'
    ];
    return lessons;
  }

  // Storage
  private async saveToStorage(): Promise<void> {
    try {
      const data = {
        memory: Array.from(this.memory.entries()),
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('bwNexusMemory', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save memory to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('bwNexusMemory');
      if (data) {
        const parsed = JSON.parse(data);
        this.memory = new Map(parsed.memory.map(([k, v]: [string, MemoryEntry[]]) => [
          k,
          v.map(entry => ({ ...entry, timestamp: new Date(entry.timestamp) }))
        ]));
      }
    } catch (error) {
      console.warn('Failed to load memory from storage:', error);
    }
  }

  private initializeLiabilityProtections(): void {
    this.liabilityRisks = [
      {
        id: 'data-privacy',
        description: 'Potential data privacy violation',
        severity: 'high',
        mitigation: 'Ensure GDPR/CCPA compliance and data anonymization',
        proactiveAction: 'Audit data handling before processing'
      },
      {
        id: 'financial-advice',
        description: 'Providing financial advice without license',
        severity: 'critical',
        mitigation: 'Disclaim that this is not financial advice',
        proactiveAction: 'Add disclaimer to all financial-related outputs'
      },
      {
        id: 'bias-discrimination',
        description: 'Potential discriminatory bias in recommendations',
        severity: 'high',
        mitigation: 'Implement bias detection and fairness checks',
        proactiveAction: 'Review recommendations for bias before output'
      },
      {
        id: 'security-breach',
        description: 'Potential security vulnerability',
        severity: 'critical',
        mitigation: 'Implement secure coding practices and regular audits',
        proactiveAction: 'Run security scan on all code changes'
      }
    ];
  }

  // Get system status
  getStatus() {
    const totalEntries = Array.from(this.memory.values()).reduce((sum, entries) => sum + entries.length, 0);
    return {
      totalMemories: totalEntries,
      categories: Array.from(this.memory.keys()),
      liabilityRisks: this.liabilityRisks.length,
      lastSaved: localStorage.getItem('bwNexusMemory') ? JSON.parse(localStorage.getItem('bwNexusMemory')!).lastSaved : null
    };
  }
}

export const persistentMemory = new PersistentMemorySystem();
