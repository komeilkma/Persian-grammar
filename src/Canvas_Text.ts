import THREE = require("three");

import { TextOptions } from "./Text2D";
import { getFontHeight } from "./utils";

export class CanvasText {

  public textWidth: number;
  public textHeight: number;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor () {
    this.textWidth = null
    this.textHeight = null

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  get width () { return this.canvas.width }
  get height () { return this.canvas.height }

  drawText (text: string, ctxOptions: TextOptions) {
    this.ctx.font = ctxOptions.font

    const lineHeight = getFontHeight(ctxOptions.font);
    const lines = (text || "").toString().split("\n");
    this.textWidth = Math.max.apply(null, lines.map(line => Math.ceil(this.ctx.measureText(line).width)));
    this.textHeight = lineHeight + lineHeight * ctxOptions.lineHeight * (lines.length - 1);

    // 2 = prevent canvas being 0 size when using empty / null text
    this.canvas.width = Math.max(2, THREE.Math.ceilPowerOfTwo(this.textWidth + (2 * ctxOptions.horizontalPadding)));
    this.canvas.height = Math.max(2, THREE.Math.ceilPowerOfTwo(this.textHeight + (2 * ctxOptions.verticalPadding)));

    this.ctx.font = ctxOptions.font

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (ctxOptions.backgroundColor) {
      this.ctx.fillStyle = ctxOptions.backgroundColor;
      this.ctx.fillRect(0, 0, this.textWidth + (2 * ctxOptions.horizontalPadding), this.textHeight + (2 * ctxOptions.verticalPadding));
    }

    this.ctx.fillStyle = ctxOptions.fillStyle
    if (ctxOptions.align.x === 1) this.ctx.textAlign = 'left';
    else if (ctxOptions.align.x === 0) this.ctx.textAlign = 'center';
    else this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'top';
    this.ctx.shadowColor = ctxOptions.shadowColor;
    this.ctx.shadowBlur = ctxOptions.shadowBlur;
    this.ctx.shadowOffsetX = ctxOptions.shadowOffsetX;
    this.ctx.shadowOffsetY = ctxOptions.shadowOffsetY;

    const x = this.textWidth * (0.5 - ctxOptions.align.x * 0.5);
    const y = 0.5 * ((lineHeight * ctxOptions.lineHeight) - lineHeight);
    for (let i = 0; i < lines.length; i++) {
      this.ctx.fillText(lines[i], x + ctxOptions.horizontalPadding, (lineHeight * ctxOptions.lineHeight * i) + ctxOptions.verticalPadding + y);
    }
    return this.canvas
  }

}


export function splitMultilineText(
  ctx: CanvasRenderingContext2D,
  value: string,
  fontStyle: string,
  width: number,
  hyperWrappingAllowed: boolean,
  getBreakOpportunities?: BreakCallback
): readonly string[] {
  const key = `${value}_${fontStyle}_${width}px`;
  const cacheResult = resultCache.get(key);
  if (cacheResult !== undefined) return cacheResult;

  if (width <= 0) {
    
      return [];
  }

  let result: string[] = [];
  const encodedLines: string[] = value.split("\n");

  const fontMetrics = metrics.get(fontStyle);
  const safeLineGuess = fontMetrics === undefined ? value.length : (width / fontMetrics.size) * 1.5;
  const hyperMode = hyperWrappingAllowed && fontMetrics !== undefined && fontMetrics.count > 20_000;

  for (let line of encodedLines) {
      let textWidth = measureText(ctx, line.slice(0, Math.max(0, safeLineGuess)), fontStyle, hyperMode);
      let measuredChars = Math.min(line.length, safeLineGuess);
      if (textWidth <= width) {
        
          result.push(line);
      } else {
          while (textWidth > width) {
              const splitPoint = getSplitPoint(
                  ctx,
                  line,
                  width,
                  fontStyle,
                  textWidth,
                  measuredChars,
                  hyperMode,
                  getBreakOpportunities
              );
              const subLine = line.slice(0, Math.max(0, splitPoint));

              line = line.slice(subLine.length);
              result.push(subLine);
              textWidth = measureText(ctx, line.slice(0, Math.max(0, safeLineGuess)), fontStyle, hyperMode);
              measuredChars = Math.min(line.length, safeLineGuess);
          }
          if (textWidth > 0) {
              result.push(line);
          }
      }
  }

  result = result.map((l, i) => (i === 0 ? l.trimEnd() : l.trim()));
  resultCache.set(key, result);
  if (resultCache.size > 500) {
  
      resultCache.delete(resultCache.keys().next().value);
  }
  return result;
}

export function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');

  const copy = document.createElement('canvas').getContext('2d');
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const l = pixels.data.length;

  let y;


  const bound = { top: null, left: null, right: null, bottom: null };

  for (let i = 0; i < l; i += 4) {
 
    if (pixels.data[i + 3] !== 0) {
    
      y = ~~(i / 4 / canvas.width);

     

      if (bound.top === null) {
        bound.top = y;
      }

      // if (bound.left === null) {
      //   bound.left = x;
      // } else if (x < bound.left) {
      //   bound.left = x;
      // }
      //
      // if (bound.right === null) {
      //   bound.right = x;
      // } else if (bound.right < x) {
      //   bound.right = x;
      // }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }


  const trimHeight = bound.bottom - bound.top;
  const trimWidth = canvas.width; 

  const trimmed = ctx.getImageData(0, bound.top, trimWidth, trimHeight);


  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);


  return