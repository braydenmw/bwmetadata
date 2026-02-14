import { ReportPayload } from '../types';
import { GovernanceService } from './GovernanceService';
import { ReportOrchestrator } from './ReportOrchestrator';

export type ExportFormat = 'pdf' | 'docx' | 'ppt' | 'dashboard' | 'interactive';

export class ExportService {
  /**
   * Export a report if governance stage allows. Returns a placeholder link.
   */
  static async exportReport(params: {
    reportId: string;
    format: ExportFormat;
    payload?: ReportPayload | null;
  }): Promise<{ link: string }> {
    const { reportId, format, payload } = params;
    if (!payload) {
      throw new Error('Export blocked. Payload is required to generate outputs.');
    }
    const validation = ReportOrchestrator.validatePayload(payload);
    if (!validation.isComplete) {
      await GovernanceService.recordProvenance({
        reportId,
        artifact: 'report-export',
        action: 'export-blocked',
        actor: 'ExportService',
        tags: [format, 'incomplete-payload', ...validation.missingFields],
        source: 'service'
      });
      throw new Error(`Export blocked until required fields are present: ${validation.missingFields.join(', ')}`);
    }
    const check = await GovernanceService.ensureStage(reportId, 'approved');
    if (!check.ok) {
      await GovernanceService.recordProvenance({
        reportId,
        artifact: 'report-export',
        action: 'export-blocked',
        actor: 'ExportService',
        tags: [format, `stage:${check.stage}`],
        source: 'service'
      });
      throw new Error(`Export blocked. Stage must be at least 'approved'. Current stage: ${check.stage}`);
    }

    await GovernanceService.recordProvenance({
      reportId,
      artifact: 'report-export',
      action: 'export-requested',
      actor: 'ExportService',
      tags: [format],
      source: 'service'
    });

    // TODO: integrate real export generator (PDF/DOCX/HTML). For now, return placeholder link.
    const link = `/exports/${reportId}-${format}-${Date.now()}`;

    await GovernanceService.recordProvenance({
      reportId,
      artifact: 'report-export',
      action: 'export-success',
      actor: 'ExportService',
      tags: [format],
      source: 'service'
    });

    return { link };
  }

  static async emailReport(reportId: string) {
    const check = await GovernanceService.ensureStage(reportId, 'approved');
    if (!check.ok) {
      await GovernanceService.recordProvenance({
        reportId,
        artifact: 'report-export',
        action: 'email-blocked',
        actor: 'ExportService',
        tags: [`stage:${check.stage}`],
        source: 'service'
      });
      throw new Error('Email blocked until stage is approved');
    }
    await GovernanceService.recordProvenance({
      reportId,
      artifact: 'report-export',
      action: 'email-requested',
      actor: 'ExportService',
      source: 'service'
    });
    // TODO: implement email delivery
    await GovernanceService.recordProvenance({
      reportId,
      artifact: 'report-export',
      action: 'email-success',
      actor: 'ExportService',
      source: 'service'
    });
  }

  static async shareLink(reportId: string) {
    const check = await GovernanceService.ensureStage(reportId, 'approved');
    if (!check.ok) {
      await GovernanceService.recordProvenance({
        reportId,
        artifact: 'report-export',
        action: 'share-blocked',
        actor: 'ExportService',
        tags: [`stage:${check.stage}`],
        source: 'service'
      });
      throw new Error('Share link blocked until stage is approved');
    }
    await GovernanceService.recordProvenance({
      reportId,
      artifact: 'report-export',
      action: 'share-requested',
      actor: 'ExportService',
      source: 'service'
    });
    const link = `/share/${reportId}-${Date.now()}`;
    await GovernanceService.recordProvenance({
      reportId,
      artifact: 'report-export',
      action: 'share-success',
      actor: 'ExportService',
      source: 'service'
    });
    return { link };
  }
}

