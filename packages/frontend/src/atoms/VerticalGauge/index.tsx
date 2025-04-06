import React from 'react';
import { Card, CardBody, Label } from 'reactstrap';

type VerticalGaugeProps = {
  title: string;
  min: number;
  max: number;
  mean: number;
  value: number;
};

export const VerticalGauge: React.FC<VerticalGaugeProps> = ({ title, min, max, mean, value }) => {
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
      <CardBody className='d-flex flex-column align-items-center'>
        <Label>{max}</Label>
        <div className='position-relative bg-light my-2 mx-0' style={{ height: `${gaugeHeight}px`, width: '4px' }}>
          <div
            className='position-absolute border border-top-1 border-primary'
            style={{
              top: `${meanPos}px`,
              left: '-8px',
              width: '20px',
              height: '1px',
              // borderTop: '1px dashed #007bff',
            }}
            title={`Mean: ${mean}`}
          ></div>

          <div
            className='position-absolute bg-danger text-white rounded-circle text-center font-weight-bold'
            style={{
              top: `${valuePos - 6}px`,
              left: '-8px',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              lineHeight: '20px',
            }}
            title={`Value: ${value}`}
          >
            {value}
          </div>
        </div>
        <Label>{min}</Label>

        <Label className='text-center'>{title}</Label>
      </CardBody>
    </Card>
  );
};
