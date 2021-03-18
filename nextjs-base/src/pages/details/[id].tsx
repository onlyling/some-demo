import React from 'react';
import type { GetServerSideProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import Head from '@/b-components/head/head';
import PageError from '@/components/page-error/page-error';
import * as Helper from '@/helpers';

interface DetailsProps {
  details: any;
  errorMsg: string;
}

interface NoticeListQuery extends ParsedUrlQuery {
  id: string;
}

/**
 * 详情
 */
const Details: React.FC<DetailsProps> = ({ details, errorMsg }) => {
  const description = Helper.getDescription(details.content || '');

  return (
    <>
      <Head title={details.title || '详情'} description={description} />

      {errorMsg ? (
        <PageError text={errorMsg} />
      ) : (
        <>
          <h1>{details.title}</h1>

          <p>
            {details.sendTime}&emsp;&emsp;阅读量&ensp;{details.viewCount}
          </p>

          <div className="g-rich-text" dangerouslySetInnerHTML={{ __html: details.content }} />
        </>
      )}
    </>
  );
};

export default Details;

export const getServerSideProps: GetServerSideProps<DetailsProps, NoticeListQuery> = async (
  params,
) => {
  const { id } = params.params as NoticeListQuery;
  let details = {} as any;
  let errorMsg = '';

  console.warn(id);

  try {
    const { data } = await Promise.resolve({ data: { content: '模拟请求' } });

    // 富文本内容转义
    data.content = decodeURIComponent(data.content);

    details = data;
  } catch (error) {
    errorMsg = error.msg || '未知错误';
    console.warn(error);
  }

  return {
    props: {
      details,
      errorMsg,
    },
  };
};
