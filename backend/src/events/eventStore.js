const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Event Sourcing & CQRS Foundation Layer
 * Instead of mutating rows (CRUD), all mutations generate immutable events.
 * This decoupled architecture allows massive-scale audit replays and async read-model projections.
 */

class EventStore {
  constructor() {
    this.events = [];
  }

  /**
   * Append a new domain event to the ledger
   * @param {string} streamId - The aggregate root ID (e.g., goalId)
   * @param {string} eventType - The action type (e.g., 'GoalApproved')
   * @param {object} payload - The delta/payload
   */
  async appendEvent(streamId, eventType, payload, userId) {
    const event = {
      eventId: crypto.randomUUID(),
      streamId,
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      metadata: { userId }
    };
    
    // In production, this saves to an Event Store DB or Kafka log
    this.events.push(event);
    logger.info(`📝 [CQRS] Event Appended: ${eventType} against stream ${streamId}`);
    
    // Broadcast to projection handlers to update Read Models
    this._publishToEventBus(event);
  }

  _publishToEventBus(event) {
    // Stub for RabbitMQ / Kafka publishing
    logger.info(`📨 [EVENT BUS] Publishing ${event.eventType} to message broker...`);
  }
}

module.exports = new EventStore();
