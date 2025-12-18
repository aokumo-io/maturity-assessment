/**
 * radar-chart.js
 * チャートを作成するためのスクリプト
 * Chart.jsを使用してカテゴリーレーダーチャートを描画します
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  // Find canvas element
  const canvasElement = document.getElementById('categoryRadarChart');
  if (!canvasElement) {
    console.warn('Radar chart canvas element not found');
    return;
  }

  // Get category scores from data attribute
  try {
    const categoryScoresStr = canvasElement.getAttribute('data-scores');
    if (!categoryScoresStr) {
      console.warn('No category scores data found');
      return;
    }

    const categoryScores = JSON.parse(categoryScoresStr);

    // Format data for radar chart
    const labels = categoryScores.map(item => item.category);
    const scores = categoryScores.map(item => item.score);

    // Create radar chart
    new Chart(canvasElement, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Your Score',
          data: scores,
          fill: true,
          backgroundColor: 'rgba(30, 64, 175, 0.2)',
          borderColor: 'rgb(30, 64, 175)',
          pointBackgroundColor: 'rgb(30, 64, 175)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(30, 64, 175)'
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating radar chart:', error);
  }
}); 