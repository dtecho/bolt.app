// app/lib/compute/contracts/resource-agreement.ts

import { v4 as uuidv4 } from 'uuid';

export type ResourceType = 'gpu' | 'cpu' | 'memory' | 'storage' | 'network';

export type ResourceLimit = {
  type: ResourceType;
  amount: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
};

export type SharingScope = {
  allowedNamespaces: string[];
  restrictedNamespaces: string[];
  timeLimit?: number; // Duration in milliseconds
};

export type PartyType = 'human' | 'ai';

export interface ResourceParty {
  id: string;
  type: PartyType;
  namespace: string;
}

export interface ResourceAgreement {
  id: string;
  threadId: string;
  timestamp: number;
  version: string;
  parties: {
    requester: ResourceParty;
    provider: ResourceParty;
  };
  resources: ResourceLimit[];
  scope: SharingScope;
  status: 'pending' | 'active' | 'completed' | 'terminated';
  signature?: {
    requester?: string;
    provider?: string;
  };
}

export class ResourceAgreementManager {
  private activeAgreements: Map<string, ResourceAgreement> = new Map();
  private readonly version = '1.0.0';

  /**
   * Creates a new resource sharing agreement between parties
   */
  public async createAgreement(
    requester: ResourceParty,
    provider: ResourceParty,
    resources: ResourceLimit[],
    scope: SharingScope
  ): Promise<ResourceAgreement> {
    const agreement: ResourceAgreement = {
      id: uuidv4(),
      threadId: uuidv4(),
      timestamp: Date.now(),
      version: this.version,
      parties: { requester, provider },
      resources,
      scope,
      status: 'pending'
    };

    this.activeAgreements.set(agreement.id, agreement);
    return agreement;
  }

  /**
   * Signs an agreement by a party
   */
  public async signAgreement(
    agreementId: string,
    partyId: string,
    signature: string
  ): Promise<ResourceAgreement> {
    const agreement = this.activeAgreements.get(agreementId);
    if (!agreement) {
      throw new Error('Agreement not found');
    }

    if (!agreement.signature) {
      agreement.signature = {};
    }

    if (partyId === agreement.parties.requester.id) {
      agreement.signature.requester = signature;
    } else if (partyId === agreement.parties.provider.id) {
      agreement.signature.provider = signature;
    } else {
      throw new Error('Invalid party ID');
    }

    // Activate agreement if both parties have signed
    if (agreement.signature.requester && agreement.signature.provider) {
      agreement.status = 'active';
    }

    return agreement;
  }

  /**
   * Validates resource usage against agreement terms
   */
  public async validateResourceUsage(
    agreementId: string,
    resourceType: ResourceType,
    amount: number
  ): Promise<boolean> {
    const agreement = this.activeAgreements.get(agreementId);
    if (!agreement || agreement.status !== 'active') {
      return false;
    }

    const resourceLimit = agreement.resources.find(r => r.type === resourceType);
    if (!resourceLimit) {
      return false;
    }

    return amount <= resourceLimit.amount;
  }

  /**
   * Terminates an active agreement
   */
  public async terminateAgreement(
    agreementId: string,
    reason: string
  ): Promise<void> {
    const agreement = this.activeAgreements.get(agreementId);
    if (!agreement) {
      throw new Error('Agreement not found');
    }

    agreement.status = 'terminated';
    // Additional cleanup logic here
  }
}

// Example thread manager that uses resource agreements
export class ThreadManager {
  private agreementManager: ResourceAgreementManager;

  constructor() {
    this.agreementManager = new ResourceAgreementManager();
  }

  /**
   * Creates a new compute thread with resource agreement
   */
  public async createThread(
    humanId: string,
    aiId: string,
    resources: ResourceLimit[]
  ): Promise<{ threadId: string; agreementId: string }> {
    // Create parties
    const human: ResourceParty = {
      id: humanId,
      type: 'human',
      namespace: 'human/private'
    };

    const ai: ResourceParty = {
      id: aiId,
      type: 'ai',
      namespace: 'ai/system'
    };

    // Define sharing scope
    const scope: SharingScope = {
      allowedNamespaces: ['human/collaborative', 'ai/assistant'],
      restrictedNamespaces: ['human/private', 'ai/system'],
      timeLimit: 3600000 // 1 hour
    };

    // Create agreement
    const agreement = await this.agreementManager.createAgreement(
      human,
      ai,
      resources,
      scope
    );

    return {
      threadId: agreement.threadId,
      agreementId: agreement.id
    };
  }
}

// Usage example:
/*
const threadManager = new ThreadManager();

// Create a new compute thread
const thread = await threadManager.createThread(
  'user123',
  'claude',
  [
    {
      type: 'gpu',
      amount: 1,
      unit: 'device',
      priority: 'high'
    },
    {
      type: 'memory',
      amount: 2048,
      unit: 'MB',
      priority: 'medium'
    }
  ]
);
*/
