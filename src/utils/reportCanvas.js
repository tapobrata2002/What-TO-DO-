
import { isOverdue } from './taskHelpers';

export const drawRoundedRect = (
  ctx,
  x,
  y,
  width,
  height,
  radius
) => {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export const drawWrappedText = (
  ctx,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  maxLines = 2
) => {
  const words = String(text).split(/\s+/);
  let line = '';
  let lineCount = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      lineCount++;

      if (lineCount >= maxLines) return;

      line = word;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, y + lineCount * lineHeight);
  }
};

export const drawProductivityCard = ({
  canvas,
  exportPeriod,
  reportPeriodTitle,
  reportCompletionRate,
  reportTasks,
  reportCompletedTasks,
  reportPendingTasks
}) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1080;

  const completedToDisplay = reportCompletedTasks.slice(0, 8);
  const pendingToDisplay = reportPendingTasks.slice(0, 8);

  const completedExtra = Math.max(
    0,
    reportCompletedTasks.length - completedToDisplay.length
  );

  const pendingExtra = Math.max(
    0,
    reportPendingTasks.length - pendingToDisplay.length
  );

  const rowHeight = 82;

  const completedHeight = Math.max(
    120,
    completedToDisplay.length * rowHeight
  );

  const pendingHeight = Math.max(
    120,
    pendingToDisplay.length * rowHeight
  );

  const height = 900 + completedHeight + pendingHeight + 150;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = '#F5F1E8';
  ctx.fillRect(0, 0, width, height);

  // Main card shadow
  drawRoundedRect(ctx, 65, 55, 950, height - 110, 34);
  ctx.fillStyle = '#1C1C1C';
  ctx.fill();

  // Main card
  drawRoundedRect(ctx, 50, 40, 950, height - 110, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.lineWidth = 7;
  ctx.strokeStyle = '#1C1C1C';
  ctx.stroke();

  // Yellow header
  drawRoundedRect(ctx, 85, 75, 880, 170, 24);
  ctx.fillStyle = '#F5D547';
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1C1C1C';
  ctx.stroke();

  ctx.fillStyle = '#1C1C1C';
  ctx.font = '900 27px Arial';
  ctx.fillText('WHAT TO-DO?', 115, 125);

  ctx.font = '900 58px Arial';
  ctx.fillText('PRODUCTIVITY', 115, 190);

  ctx.font = 'bold 25px Arial';
  ctx.fillText(
    `${exportPeriod.toUpperCase()} REPORT · ${reportPeriodTitle}`,
    115,
    225
  );

  // Completion rate
  ctx.font = '900 100px Arial';
  ctx.fillText(`${reportCompletionRate}%`, 115, 385);

  ctx.font = 'bold 27px Arial';
  ctx.fillText('COMPLETION RATE', 120, 430);

  drawRoundedRect(ctx, 115, 460, 790, 28, 14);
  ctx.fillStyle = '#E8E5DC';
  ctx.fill();

  if (reportCompletionRate > 0) {
    drawRoundedRect(
      ctx,
      115,
      460,
      Math.max(28, 790 * reportCompletionRate / 100),
      28,
      14
    );

    ctx.fillStyle = '#F5D547';
    ctx.fill();
  }

  // Statistics
  const statY = 530;
  const statWidth = 245;
  const statHeight = 125;
  const statGap = 45;

  const stats = [
    {
      label: 'TOTAL TASKS',
      value: reportTasks.length,
      color: '#F5D547'
    },
    {
      label: 'COMPLETED',
      value: reportCompletedTasks.length,
      color: '#DDF5E5'
    },
    {
      label: 'PENDING',
      value: reportPendingTasks.length,
      color: '#FCE5E5'
    }
  ];

  stats.forEach((stat, index) => {
    const x = 115 + index * (statWidth + statGap);

    drawRoundedRect(
      ctx,
      x + 8,
      statY + 8,
      statWidth,
      statHeight,
      20
    );

    ctx.fillStyle = '#1C1C1C';
    ctx.fill();

    drawRoundedRect(
      ctx,
      x,
      statY,
      statWidth,
      statHeight,
      20
    );

    ctx.fillStyle = stat.color;
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1C1C1C';
    ctx.stroke();

    ctx.fillStyle = '#1C1C1C';
    ctx.font = '900 45px Arial';
    ctx.fillText(String(stat.value), x + 22, statY + 58);

    ctx.font = 'bold 18px Arial';
    ctx.fillText(stat.label, x + 22, statY + 96);
  });

  // COMPLETED TASKS
  let listStartY = 710;

  ctx.fillStyle = '#1C1C1C';
  ctx.font = '900 30px Arial';
  ctx.fillText('COMPLETED TASKS', 115, listStartY);

  ctx.font = 'bold 19px Arial';
  ctx.fillStyle = '#777777';
  ctx.fillText(
    `${reportCompletedTasks.length} TASKS COMPLETED IN THIS PERIOD`,
    115,
    listStartY + 35
  );

  if (completedToDisplay.length === 0) {
    ctx.font = 'bold 23px Arial';
    ctx.fillText(
      'No completed tasks in this period yet.',
      115,
      listStartY + 100
    );
  } else {
    completedToDisplay.forEach((task, index) => {
      const y = listStartY + 65 + index * rowHeight;

      drawRoundedRect(ctx, 115, y, 790, 65, 16);
      ctx.fillStyle = '#F5F1E8';
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1C1C1C';
      ctx.stroke();

      drawRoundedRect(ctx, 130, y + 15, 135, 35, 12);
      ctx.fillStyle = '#DDF5E5';
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1C1C1C';
      ctx.stroke();

      ctx.fillStyle = '#16803C';
      ctx.font = 'bold 15px Arial';
      ctx.fillText('COMPLETED', 145, y + 38);

      ctx.fillStyle = '#1C1C1C';
      ctx.font = 'bold 22px Arial';

      drawWrappedText(
        ctx,
        task.text,
        290,
        y + 28,
        570,
        26,
        2
      );
    });
  }

  if (completedExtra > 0) {
    ctx.fillStyle = '#303030';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(
      `+ ${completedExtra} more completed tasks`,
      115,
      listStartY + 65 + completedToDisplay.length * rowHeight
    );
  }

  // PENDING TASKS
  listStartY += completedHeight + 125;

  ctx.fillStyle = '#1C1C1C';
  ctx.font = '900 30px Arial';
  ctx.fillText('PENDING TASKS', 115, listStartY);

  ctx.font = 'bold 19px Arial';
  ctx.fillStyle = '#777777';
  ctx.fillText(
    `${reportPendingTasks.length} PENDING TASKS IN THIS PERIOD`,
    115,
    listStartY + 35
  );

  if (pendingToDisplay.length === 0) {
    ctx.font = 'bold 23px Arial';
    ctx.fillText(
      'Great work! No pending tasks in this period.',
      115,
      listStartY + 100
    );
  } else {
    pendingToDisplay.forEach((task, index) => {
      const y = listStartY + 65 + index * rowHeight;

      drawRoundedRect(ctx, 115, y, 790, 65, 16);
      ctx.fillStyle = '#F5F1E8';
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1C1C1C';
      ctx.stroke();

      const overdue = isOverdue(task);

      drawRoundedRect(ctx, 130, y + 15, 135, 35, 12);
      ctx.fillStyle = overdue ? '#FCE5E5' : '#FFF0C2';
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1C1C1C';
      ctx.stroke();

      ctx.fillStyle = overdue ? '#B42318' : '#805B00';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(
        overdue ? 'OVERDUE' : 'PENDING',
        145,
        y + 38
      );

      ctx.fillStyle = '#1C1C1C';
      ctx.font = 'bold 22px Arial';

      drawWrappedText(
        ctx,
        task.text,
        290,
        y + 28,
        570,
        26,
        2
      );
    });
  }

  if (pendingExtra > 0) {
    ctx.fillStyle = '#303030';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(
      `+ ${pendingExtra} more pending tasks`,
      115,
      listStartY + 65 + pendingToDisplay.length * rowHeight
    );
  }
};
