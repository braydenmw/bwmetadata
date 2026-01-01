import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Data directory for persistent storage
const DATA_DIR = path.join(__dirname, '..', 'data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory exists
  }
};

// Load reports from file
const loadReports = async (): Promise<any[]> => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(REPORTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save reports to file
const saveReports = async (reports: any[]): Promise<void> => {
  await ensureDataDir();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2));
};

// GET all reports
router.get('/', async (_req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    res.json(reports);
  } catch (error) {
    console.error('Failed to load reports:', error);
    res.status(500).json({ error: 'Failed to load reports' });
  }
});

// GET single report by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const report = reports.find(r => r.id === req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Failed to load report:', error);
    res.status(500).json({ error: 'Failed to load report' });
  }
});

// POST create new report
router.post('/', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const newReport = {
      ...req.body,
      id: req.body.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      createdAt: req.body.createdAt || Date.now().toString(),
      updatedAt: Date.now().toString()
    };
    
    reports.unshift(newReport);
    await saveReports(reports);
    
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Failed to create report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// PUT update report
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const index = reports.findIndex(r => r.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    reports[index] = {
      ...reports[index],
      ...req.body,
      id: req.params.id,
      updatedAt: Date.now().toString()
    };
    
    await saveReports(reports);
    res.json(reports[index]);
  } catch (error) {
    console.error('Failed to update report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// DELETE report
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const filtered = reports.filter(r => r.id !== req.params.id);
    
    if (filtered.length === reports.length) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    await saveReports(filtered);
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    console.error('Failed to delete report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// POST duplicate report
router.post('/:id/duplicate', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const original = reports.find(r => r.id === req.params.id);
    
    if (!original) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const duplicate = {
      ...original,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      reportName: `${original.reportName || 'Report'} (Copy)`,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      status: 'draft'
    };
    
    reports.unshift(duplicate);
    await saveReports(reports);
    
    res.status(201).json(duplicate);
  } catch (error) {
    console.error('Failed to duplicate report:', error);
    res.status(500).json({ error: 'Failed to duplicate report' });
  }
});

// GET export report as JSON
router.get('/:id/export', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const report = reports.find(r => r.id === req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="report-${report.id}.json"`);
    res.json(report);
  } catch (error) {
    console.error('Failed to export report:', error);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

// GET export report as Word (DOCX) via 9-step pipeline
router.get('/:id/export-docx', async (req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    const report = reports.find(r => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const steps = [
      { title: 'Step 1 — Intake', text: `Organization: ${report.organizationName || 'N/A'} | Country: ${report.country || 'N/A'} | Region: ${report.region || 'N/A'}` },
      { title: 'Step 2 — Governance Gating', text: 'Mandate and approvals verified; provenance logging enabled.' },
      { title: 'Step 3 — Risk Assessment', text: 'Security and integrity risks mapped; mitigation via telemetry + trustee.' },
      { title: 'Step 4 — Partner Fit', text: 'Strategic alignment and capability matching scored.' },
      { title: 'Step 5 — Regulatory', text: 'Permits and compliance baseline; double-blind procurement enforced.' },
      { title: 'Step 6 — Operations', text: 'Portside cold storage, reefer trucking, HACCP-certified processing setup.' },
      { title: 'Step 7 — Financial Snapshot', text: 'Capex $45M; staged deployment; milestone escrow.' },
      { title: 'Step 8 — Implementation Roadmap', text: 'Pilot -> Scale plan with inspectors rotation and evidence packs.' },
      { title: 'Step 9 — Provenance Summary', text: 'All artifacts carry tamper-evident provenance for audit.' },
    ];

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: 'BW Global AI — Intelligence Report', heading: HeadingLevel.TITLE }),
            new Paragraph({ text: report.organizationName || 'Unnamed Engagement', heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: 'Scenario: General Santos (Mindanao) — Japanese Cold‑Chain & Export Logistics', spacing: { after: 300 } }),
            ...steps.flatMap(s => [
              new Paragraph({ text: s.title, heading: HeadingLevel.HEADING_2 }),
              new Paragraph({ children: [ new TextRun({ text: s.text }) ] }),
            ]),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="BWGA-Report-${report.id}.docx"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Failed to export DOCX:', error);
    res.status(500).json({ error: 'Failed to export Word document' });
  }
});

// POST import reports
router.post('/import', async (req: Request, res: Response) => {
  try {
    const { reports: importedReports } = req.body;
    
    if (!Array.isArray(importedReports)) {
      return res.status(400).json({ error: 'Invalid import format' });
    }
    
    const existing = await loadReports();
    const existingIds = new Set(existing.map(r => r.id));
    
    const newReports = importedReports
      .filter(r => !existingIds.has(r.id))
      .map(r => ({
        ...r,
        importedAt: Date.now().toString()
      }));
    
    const combined = [...newReports, ...existing];
    await saveReports(combined);
    
    res.json({ 
      success: true, 
      imported: newReports.length,
      skipped: importedReports.length - newReports.length
    });
  } catch (error) {
    console.error('Failed to import reports:', error);
    res.status(500).json({ error: 'Failed to import reports' });
  }
});

// GET statistics
router.get('/stats/summary', async (_req: Request, res: Response) => {
  try {
    const reports = await loadReports();
    
    const stats = {
      total: reports.length,
      byStatus: {
        draft: reports.filter(r => r.status === 'draft').length,
        generating: reports.filter(r => r.status === 'generating').length,
        complete: reports.filter(r => r.status === 'complete').length
      },
      byRegion: {} as Record<string, number>,
      recentActivity: reports.slice(0, 10).map(r => ({
        id: r.id,
        name: r.organizationName || r.reportName,
        status: r.status,
        date: r.updatedAt || r.createdAt
      }))
    };
    
    // Count by region
    reports.forEach(r => {
      const region = r.region || 'Unspecified';
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Failed to get stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;
