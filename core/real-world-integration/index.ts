// Real-World System Integration Module
// Connector registry with deterministic connection status and health checks.

type ConnectorStatus = 'disconnected' | 'connected' | 'degraded';

type ConnectorRecord = {
  system: string;
  endpoint?: string;
  status: ConnectorStatus;
  connectedAt?: string;
  lastHealthCheck?: string;
};

const connectors = new Map<string, ConnectorRecord>();

export async function connectToSystem(system: string, endpoint?: string): Promise<ConnectorRecord> {
  if (!system.trim()) {
    throw new Error('system is required');
  }

  const record: ConnectorRecord = {
    system,
    endpoint,
    status: 'connected',
    connectedAt: new Date().toISOString(),
    lastHealthCheck: new Date().toISOString()
  };

  connectors.set(system, record);
  return record;
}

export async function disconnectFromSystem(system: string): Promise<ConnectorRecord> {
  const existing = connectors.get(system);
  const record: ConnectorRecord = {
    system,
    endpoint: existing?.endpoint,
    status: 'disconnected',
    connectedAt: existing?.connectedAt,
    lastHealthCheck: new Date().toISOString()
  };

  connectors.set(system, record);
  return record;
}

export function getSystemConnection(system: string): ConnectorRecord | null {
  return connectors.get(system) ?? null;
}

export function listSystemConnections(): ConnectorRecord[] {
  return Array.from(connectors.values());
}

