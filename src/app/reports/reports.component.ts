import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, AfterViewInit {

  ahpResults: any[] = [];
  topsisResults: any[] = [];
  prometheeResults: any[] = [];
  wsmResults: any[] = [];

  ngAfterViewInit() {
    this.initScrollTriggerForCharts();
  }

  ngOnInit(): void {
    this.loadData();
    this.drawSeparateBarCharts();
  }

  initScrollTriggerForCharts() {
    // Poiščemo glavni element, v katerem rišemo
    const barChartsElement = document.getElementById('bar-charts');
    if (!barChartsElement) return;

    // Ustvarimo IntersectionObserver:
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      // 1) Ko element pride v vidno polje
      if (entry.isIntersecting) {
        observer.unobserve(barChartsElement)
        // Najprej (po želji) počistimo, če je kaj ostalo
        // Da se graf res nariše na novo od začetka

        d3.select('#bar-charts').html('');

        // Znova narišemo grafe (in se bo zgodila animacija)
        this.drawSeparateBarCharts();
      }
    }, {
      threshold: 0.3
      // Ko je 30% elementa v viewportu, se sproži
    });

    // Povemo observer-ju, naj opazuje #bar-charts
    observer.observe(barChartsElement);
  }

  loadData(): void {

    // Pridobimo in obdelamo podatke za AHP Results
    const ahpRawData = JSON.parse(localStorage.getItem('AHP_Results_Combined') || '[]');
    this.ahpResults = ahpRawData.map((item: { values: any[]; ahpResult: any; rank: any; }) => ({
      Alternative: item.values[0],
      Value1: item.values[1],
      Value2: item.values[2],
      Value3: item.values[3],
      Result: item.ahpResult,
      Rank: item.rank
    }));

    // TOPSIS Results
    const topsisRawData = JSON.parse(localStorage.getItem('TOPSIS_Results') || '[]');
    if (Array.isArray(topsisRawData)) {
      this.topsisResults = topsisRawData.map((item: any) => ({
        Alternative: item.Alternative,
        Ideal_Distance: item.Ideal_Distance,
        Anti_Ideal_Distance: item.Anti_Ideal_Distance,
        Result: item.Result,
        Rank: parseInt(item.rank, 10)
      }));
    } else {
      console.warn('TOPSIS Results is not an array:', topsisRawData);
    }

    // Promethee II Results
    const prometheeRawData = JSON.parse(localStorage.getItem('PrometheeII_Results') || '[]');
    if (Array.isArray(prometheeRawData)) {
      this.prometheeResults = prometheeRawData.map((item: any) => ({
        Alternative: item.Alternative,
        PositiveFlow: item.PositiveFlow,
        NegativeFlow: item.NegativeFlow,
        NetFlow: item.NetFlow,
        Result: item.Result,
        Rank: parseInt(item.Ranking, 10)
      }));
    } else {
      console.warn('Promethee II Results is not an array:', prometheeRawData);
    }

    // WSM Results
    const wsmRawData = JSON.parse(localStorage.getItem('WSM_Results') || '[]');
    if (Array.isArray(wsmRawData)) {
      this.wsmResults = wsmRawData.map((item: any) => ({
        Alternative: item.alternative,
        Result: item.rezultat,
        Rank: 0 // Calculate rank dynamically
      }));
      this.wsmResults = this.rankResults(this.wsmResults, 'Result');
    } else {
      console.warn('WSM Results is not an array:', wsmRawData);
    }
  }
  rankResults(data: any[], key: string): any[] {
    const sortedData = [...data].sort((a, b) => b[key] - a[key]);
    sortedData.forEach((item, index) => {
      item.Rank = index + 1;
    });
    return sortedData;
  }

  //method for drawing separate Bar Charts
  drawSeparateBarCharts(): void {
    const methods = [
      { name: 'AHP', data: this.ahpResults },
      { name: 'TOPSIS', data: this.topsisResults },
      { name: 'PROMETHEE', data: this.prometheeResults },
      { name: 'WSM', data: this.wsmResults }
    ];

    const width = 470;
    const height = 300;
    const margin = { top: 80, right: 35, bottom: 100, left: 80 };

    methods.forEach((method, methodIndex) => {
      const data: BarChartData[] = method.data
        .map((item: any) => ({
          Alternative: item.Alternative || 'Unknown',
          Result: item.Result ?? 0
        }))
        .sort((a, b) => b.Result - a.Result);

      const container = d3.select('#bar-charts')
        .append('div')
        .style('display', 'inline-block')
        .style('margin', '20px')
        .style('border', '1px solid #ccc')
        .style('padding', '10px');

      container.append('h4')
        .text(`${method.name} Results`)
        .style('text-align', 'center')
        .style('font-size', '20px')
        .style('font-weight', 'bold');

      const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const minValue = d3.min(data, d => d.Result) ?? 0;
      const maxValue = d3.max(data, d => d.Result) ?? 0;

      const x = d3.scaleBand()
        .domain(data.map(d => d.Alternative))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([Math.min(0, minValue), maxValue])
        .range([height, 0]);

      const defs = svg.append('defs');
      data.forEach((d, i) => {
        const gradientId = `gradient-${methodIndex}-${i}`;
        const gradient = defs.append('linearGradient')
          .attr('id', gradientId)
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%');

        if (d.Result >= 0) {
          gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#3498db'); // Temna barva
          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#add8e6'); // Svetla barva
        } else {
          gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#f5b7b1'); // Temno rdeča
          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#e74c3c'); // Svetlo rdeča
        }
      });

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '16px')
        .attr('transform', 'rotate(-45)')
        .attr('dy', '1em')
        .attr('dx', '-0.5em');

      svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', '16px');

      svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.Alternative) || 0)
        .attr('y', y(0))
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', (d, i) => `url(#gradient-${methodIndex}-${i})`)
        .transition()
        .duration(2000)
        .attr('y', d => d.Result >= 0 ? y(d.Result) : y(0))
        .attr('height', d => Math.abs(y(d.Result) - y(0)));

      // Dodajanje legende
      const legend = svg.append('g')
        .attr('transform', `translate(${width - 120}, ${-margin.top + 10})`);

      // Legenda za pozitivne stolpce
      legend.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('y', 0)
        .attr('fill', '#3498db'); // Temno modra

      legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '16px')
        .text('Positive Values');

      // Legenda za negativne stolpce
      legend.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('y', 20)
        .attr('fill', '#e74c3c'); // Temno rdeča

      legend.append('text')
        .attr('x', 20)
        .attr('y', 32)
        .style('font-size', '16px')
        .text('Negative Values');
    });
  }

}



//interfaces

interface AHPResult {
  values: [string, number, number, number];
  ahpResult: number;
  rank: number;
}

interface TOPSISResult {
  Alternative: string;
  Ideal_Distance: number;
  Anti_Ideal_Distance: number;
  Result: number;
  rank: string;
}

interface PrometheeResult {
  Alternative: string;
  PositiveFlow: number;
  NegativeFlow: number;
  NetFlow: number;
  Result: number;
  Ranking: string;
}

interface WSMResult {
  alternative: string;
  rezultat: number;
}

interface BarChartData {
  Alternative: string;
  Result: number;
}




