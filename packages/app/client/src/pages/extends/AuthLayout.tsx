import { css } from '@emotion/css';
import { useSystemSettings } from '@nocobase/client';
import { PoweredBy } from './PoweredBy';

export function AuthLayout(props: any) {
  const { data } = useSystemSettings();
  return (
    <div
      style={{
        maxWidth: 320,
        margin: '0 auto',
        paddingTop: '20vh',
      }}
    >
      <h1>{data?.data?.title}</h1>
      {props.children}
      <div
        className={css`
          position: absolute;
          bottom: 24px;
          width: 100%;
          left: 0;
          text-align: center;
        `}
      >
        <PoweredBy />
      </div>
    </div>
  );
}
