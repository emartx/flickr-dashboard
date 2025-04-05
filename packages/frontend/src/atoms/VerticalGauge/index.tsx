import React from 'react';
import { Card, CardBody, Label } from 'reactstrap';

type VerticalGaugeProps = {
  min: number;
  max: number;
  mean: number;
  value: number;
};

export const VerticalGauge: React.FC<VerticalGaugeProps> = ({ min, max, mean, value }) => {
  const gaugeHeight = 300;

  const getRelativePosition = (val: number) => {
    if (max === min) return 0;
    const clamped = Math.max(min, Math.min(max, val));
    return ((clamped - min) / (max - min)) * gaugeHeight;
  };

  const meanPos = gaugeHeight - getRelativePosition(mean);
  const valuePos = gaugeHeight - getRelativePosition(value);

  return (
    <Card style={{ width: '120px', margin: '1rem' }}>
      <CardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Label>{max}</Label>
        <div style={{ position: 'relative', height: `${gaugeHeight}px`, width: '4px', backgroundColor: '#ccc', margin: '10px 0' }}>
          <div
            style={{
              position: 'absolute',
              top: `${meanPos}px`,
              left: '-8px',
              width: '20px',
              height: '1px',
              borderTop: '1px dashed #007bff',
            }}
            title={`Mean: ${mean}`}
          ></div>

          <div
            style={{
              position: 'absolute',
              top: `${valuePos - 6}px`,
              left: '-8px',
              width: '20px',
              height: '12px',
              backgroundColor: '#dc3545',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#fff',
              fontSize: '12px',
              lineHeight: '12px',
              fontWeight: 'bold',
            }}
            title={`Value: ${value}`}
          >
            {value}
          </div>
        </div>
        <Label>{min}</Label>
      </CardBody>
    </Card>
  );
};
