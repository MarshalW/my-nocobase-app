import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

export const PoweredBy = () => {
  const { i18n } = useTranslation();
  const urls = {
    'en-US': 'https://www.sevenseasculture.cn',
    'zh-CN': 'https://www.sevenseasculture.cn',
  };
  return (
    <div
      className={css`
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        a {
          color: rgba(0, 0, 0, 0.45);
          &:hover {
            color: rgba(0, 0, 0, 0.85);
          }
        }
      `}
    >
      {/* @ts-ignore */}
      <a href={urls[i18n.language] || urls['en-US']}>广州七海文化创意有限公司</a>
    </div>
  );
};
