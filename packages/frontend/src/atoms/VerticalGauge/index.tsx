import React from 'react';
import { Card, CardBody, Label } from 'reactstrap';

type VerticalGaugeProps = {
  title: string;
  icon: string;
  min: number;
  max: number;
  mean: number;
  value: number;
};

export const VerticalGauge: React.FC<VerticalGaugeProps> = ({ title, icon, min, max, mean, value }) => {
  const gaugeHeight = Math.round(0.07 * window.innerWidth + 43);

  const getRelativePosition = (val: number) => {
    if (max === min) return 0;
    const clamped = Math.max(min, Math.min(max, val));
    return ((clamped - min) / (max - min)) * gaugeHeight;
  };

  const meanPos = gaugeHeight - getRelativePosition(mean);
  const valuePos = gaugeHeight - getRelativePosition(value);

  return (
    <Card className='w-100 h-100 m-0' style={{ maxWidth: '120px' }}>
      <CardBody className='d-flex flex-column align-items-center p-0'>
        <Label>{max}</Label>
        <div className='position-relative bg-light my-2 mx-0' style={{ height: `${gaugeHeight}px`, width: '4px' }}>
          <div
            className='position-absolute border border-top-1 border-primary'
            style={{
              top: `${meanPos}px`,
              left: '-8px',
              width: '20px',
              height: '1px',
              borderStyle: 'dashed',
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

        <Label className='text-center'><i className={icon}></i> {title}</Label>
      </CardBody>
    </Card>
  );
};
