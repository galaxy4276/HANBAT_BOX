import React, {
  ReactNode,
  DetailedHTMLProps,
  HTMLAttributes,
  useState,
  useEffect,
} from 'react';
import clsx from 'clsx';
import { Button, Input, Typo, useModal } from '@shared/ui';
import { download } from '@features/upload-box';
import { useLoading } from '@widgets/modal';
import { useDeleteMutation } from '@features/upload-box/api/useDeleteMutation';
import WebDownloader from '@features/download';
import ga from 'react-ga4';

type Props = { children: ReactNode } & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Card: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <article
      className={clsx([
        'w-full border-[2px] border-[#E3E3E3] bg-white drop-shadow-sm rounded-[12px]',
        className,
      ])}
      {...props}
    >
      {children}
    </article>
  );
};

export const DownloadHeader = () => {
  // const { data } = useAccessQuery();
  // const accessible = !!data?.accessible;

  // if (!accessible) {
  //   return (
  //     <div className="flex justify-center">
  //       <Typo size={20} color="red" bold>
  //         교외&nbsp;
  //       </Typo>
  //       <Typo size={20} color="black" bold>
  //         접근 안내
  //       </Typo>
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center">
      <Typo size={20} color="red" bold>
        비밀번호
      </Typo>
      <Typo size={20} color="black" bold>
        를 입력하세요
      </Typo>
    </div>
  );
};

type DownloadBodyProps = {
  id: number;
};

export const DownloadBody: React.FC<DownloadBodyProps> = ({ id }) => {
  const [password, setPassword] = useState('');
  const { createModal, openById, closeById } = useModal();
  const { onLoading, finishLoading } = useLoading();
  const { mutateAsync: deleteFile } = useDeleteMutation();
  // const accessQuery = useAccessQuery();
  // const accessable = !!accessQuery.data?.accessible;

  const close = () => closeById(`download-${id}`);

  const onClickDownload = async () => {
    try {
      ga.event({
        category: '상호작용',
        action: '다운로드 시도',
        label: `[id: ${id}]`,
      });
      onLoading();
      const { blob, filename } = await download(id, password);
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = filename;
      anchor.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
      URL.revokeObjectURL(anchor.href);
      openById('download-complete');
      ga.event({
        category: '상호작용',
        action: '다운로드 성공',
        label: `[id: ${id}]`,
      });
    } catch (error) {
      console.log(error);

      const status = (error as any)?.status as number;
      if (status === 401) {
        openById('password-invalid-error');
        return;
      }
      openById('download-failed');
      ga.event({
        category: '상호작용',
        action: '다운로드 실패',
        label: `[id: ${id}], ${error}`,
      });
    } finally {
      finishLoading();
      closeById(`download-${id}`);
    }
  };

  const onClickCopyDownloadLink = () => {
    const downloadUrl = WebDownloader.createDownloadLink(id);
    WebDownloader.copyOnDevice(downloadUrl, () => openById('copy-complete'));
  };

  const onClickDeleteFile = async () => {
    try {
      await deleteFile({ id, password });
      alert('삭제를 완료하였습니다!');
      closeById(`download-${id}`);
    } catch (e) {
      console.error(e);
      openById('password-invalid-error');
    }
  };

  useEffect(() => {
    createModal({
      id: 'password-invalid-error',
      node: () => (
        <div>
          <Typo size={14}>패스워드가 잘못되었습니다.</Typo>
        </div>
      ),
    });

    createModal({
      id: 'copy-complete',
      header: (
        <Typo size={16} bold>
          완료
        </Typo>
      ),
      node: () => <Typo size={14}>다운로드 링크를 복사하였습니다.</Typo>,
    });

    createModal({
      id: 'download-failed',
      header: (
        <Typo size={16} bold>
          다운로드 실패
        </Typo>
      ),
      node: () => (
        <Typo size={14}>
          현재 서버 통신이 잠시 원활하지 못했어요. 다운로드를 다시 시도해주세요.
        </Typo>
      ),
    });
  }, []);

  return (
    <div>
      {/*{!accessable && (*/}
      {/*  <div className="flex flex-col text-center justify-center">*/}
      {/*    <Typo size={14} color="gray">*/}
      {/*      교외 지역이므로 다운로드는 수행할 수 없습니다.*/}
      {/*    </Typo>*/}
      {/*    <Typo size={12} color="gray">*/}
      {/*      관리자에게 요청하시거나 교외에서 다시 시도해주세요.*/}
      {/*    </Typo>*/}
      {/*  </div>*/}
      {/*)}*/}

      <div className="flex gap-x-2">
        <Input
          placeholder="****"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          theme="white"
          className="px-10 w-[60px] py-1"
          onClick={onClickDeleteFile}
        >
          삭제
        </Button>
      </div>

      <div className="flex w-full justify-center py-2.5">
        <Button
          theme="white"
          className="!py-1"
          onClick={onClickCopyDownloadLink}
        >
          다운로드 링크 복사
        </Button>
      </div>

      <div className="mt-[20px] flex gap-x-2">
        <Button
          theme="primary"
          className="flex-[0.6] !px-[10px]"
          onClick={onClickDownload}
        >
          비밀번호 확인 후 다운로드
        </Button>
        <Button
          theme="white"
          // className={accessable ? 'flex-[0.4]' : 'flex-1'}
          className="flex-[0.4]"
          onClick={close}
        >
          닫기
        </Button>
      </div>
    </div>
  );
};
