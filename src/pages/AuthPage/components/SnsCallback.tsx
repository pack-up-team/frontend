import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import { useForm, Controller } from 'react-hook-form';
import authService, {
  type SnsUserInfo,
  type AdditionalInfoRequest,
  type PhoneValidationRequest,
} from '../../../api/authService';

interface AdditionalInfoForm {
  phoneNum: string;
  password: string;
}

const SnsCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [userInfo, setUserInfo] = useState<SnsUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const { control, handleSubmit, watch, setValue } = useForm<AdditionalInfoForm>({
    defaultValues: { phoneNum: '', password: '' },
    mode: 'onChange',
  });

  const phoneNum = watch('phoneNum');

  // (선택) 개발 환경에서 콜백 파라미터가 없으면 목업 파라미터 자동 주입
  useEffect(() => {
    const hasUserInfo = searchParams.get('userInfo');
    const hasError = searchParams.get('error');
    if (!hasUserInfo && !hasError && import.meta.env.DEV) {
      const mock = {
        userId: 'demo-1',
        userNm: '홍길동',
        email: 'hong@test.com',
        loginType: 'Google',
        needsAdditionalInfo: true,
      };
      const url = new URL(window.location.href);
      url.searchParams.set('userInfo', encodeURIComponent(JSON.stringify(mock)));
      window.history.replaceState({}, document.title, url);
    }
  }, [searchParams]);

  // SNS 콜백 파라미터 처리
  useEffect(() => {
    const userInfoParam = searchParams.get('userInfo');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      handleSnsError(errorParam);
      cleanUrl();
      return;
    }

    if (userInfoParam) {
      try {
        const decodedUserInfo = JSON.parse(decodeURIComponent(userInfoParam));
        setUserInfo(decodedUserInfo);

        // 추가 정보 필요 없으면 바로 대시보드로 이동
        if (!decodedUserInfo.needsAdditionalInfo) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
        setError('SNS 로그인 정보를 처리하는 중 오류가 발생했습니다.');
      }
    } else {
      setError('SNS 로그인 정보가 없습니다.');
    }

    setIsLoading(false);
    cleanUrl();
     
  }, [searchParams, navigate]);

  const cleanUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('userInfo');
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url);
  };

  const handleSnsError = (err: string) => {
    let errorMessage = '';
    switch (err) {
      case 'sns_duplicate_email':
        errorMessage =
            '이미 다른 SNS 계정으로 가입된 이메일입니다.\n기존에 가입하신 SNS 계정으로 로그인해주세요.';
        break;
      case 'general_user_email':
        errorMessage =
            '이미 일반 회원으로 가입된 이메일입니다.\n일반 로그인을 이용해주세요.';
        break;
      default:
        errorMessage = 'SNS 로그인 중 오류가 발생했습니다.';
    }
    setError(errorMessage);
    setIsLoading(false);
  };

  // 전화번호 중복/정합성 검증 (useCallback으로 감싸서 의존성 안정화)
  const validatePhoneNumber = useCallback(
      async (num: string) => {
        if (!num || !userInfo) return;

        try {
          const validationData: PhoneValidationRequest = {
            phoneNum: num,
            userId: userInfo.userId,
          };

          const result = await authService.validatePhoneNumber(validationData);

          setPhoneValidation({
            isValid: result.success && (result.available ?? false),
            message: result.message,
          });
        } catch (e) {
          console.error('핸드폰번호 검증 오류:', e);
          setPhoneValidation({
            isValid: false,
            message: '검증 중 오류가 발생했습니다.',
          });
        }
      },
      [userInfo],
  );

  // 핸드폰번호 실시간 검증 트리거
  useEffect(() => {
    if (phoneNum && phoneNum.length >= 13 && userInfo) {
      // 010-0000-0000 형식
      void validatePhoneNumber(phoneNum);
    } else {
      setPhoneValidation(null);
    }
  }, [phoneNum, userInfo, validatePhoneNumber]);

  const onSubmitAdditionalInfo = async (data: AdditionalInfoForm) => {
    if (!userInfo) return;

    // 서버 검증 결과 불가일 때 차단
    if (phoneValidation && !phoneValidation.isValid) {
      alert(phoneValidation.message);
      return;
    }

    try {
      const payload: AdditionalInfoRequest = {
        userId: userInfo.userId,
        phoneNum: data.phoneNum,
        password: data.password,
      };

      const result = await authService.submitAdditionalInfo(payload);

      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/dashboard');
      } else {
        // 구체적 에러별 대응
        if (result.message.includes('다른 SNS 계정으로 가입된')) {
          showErrorModal(
              'SNS 계정 중복',
              '이미 다른 SNS 계정으로 가입된 핸드폰번호입니다.\n각 SNS 계정마다 고유한 핸드폰번호를 사용해주세요.',
              [
                { text: '다른 SNS로 로그인', action: () => navigate('/auth?mode=login') },
                { text: '다른 번호 사용', action: () => clearPhoneField() },
              ],
          );
        } else if (result.message.includes('일반 회원으로 가입된')) {
          showErrorModal(
              '일반 회원 계정 존재',
              '이미 일반 회원으로 가입된 핸드폰번호입니다.\n다른 번호를 사용해주세요.',
              [
                { text: '일반 로그인 하기', action: () => navigate('/auth?mode=login') },
                { text: '다른 번호 사용', action: () => clearPhoneField() },
              ],
          );
        } else {
          alert('오류: ' + result.message);
        }
      }
    } catch (e) {
      console.error('추가 정보 제출 오류:', e);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const showErrorModal = (
      title: string,
      message: string,
      actions: Array<{ text: string; action: () => void }>,
  ) => {
    // 실제 구현에서는 모달 컴포넌트를 권장
    const confirmed = confirm(`${title}\n\n${message}`);
    if (confirmed && actions[0]) {
      actions[0].action();
    } else if (actions[1]) {
      actions[1].action();
    }
  };

  const clearPhoneField = () => {
    setValue('phoneNum', '');
    setPhoneValidation(null);
  };

  // 로딩 화면
  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#775CFF] mx-auto mb-4" />
            <p className="text-[#707070]">SNS 로그인 처리 중...</p>
          </div>
        </div>
    );
  }

  // 오류 화면
  if (error) {
    return (
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="text-center">
            <h2 className="text-[20px] font-bold text-[#141414] mb-4">⚠️ 로그인 오류</h2>
          </div>
          <p className="text-[#707070] whitespace-pre-line mb-6">{error}</p>
          <Button onClick={() => navigate('/auth?mode=login')}>로그인 페이지로 돌아가기</Button>
        </div>
    );
  }

  // 추가 정보 불필요: 성공 안내
  if (userInfo && !userInfo.needsAdditionalInfo) {
    return (
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="text-center">
            <h2 className="text-[26px] font-bold text-[#141414] mb-4">🎉 로그인 성공!</h2>
            <p className="text-[#707070] mb-2">{userInfo.loginType} 로그인이 완료되었습니다.</p>
            <p className="text-[#707070]">잠시 후 대시보드로 이동합니다...</p>
          </div>
        </div>
    );
  }

  // 추가 정보 입력 폼
  if (userInfo && userInfo.needsAdditionalInfo) {
    return (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-[26px] font-bold text-[#141414] mb-4">추가 정보 입력</h2>
            <p className="text-[#707070] mb-2">{userInfo.loginType} 로그인이 완료되었습니다.</p>
            <p className="text-[#707070]">서비스 이용을 위해 추가 정보를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitAdditionalInfo)} className="flex flex-col gap-6">
            {/* 이름 (읽기 전용) */}
            <div className="relative">
              <FormInput
                  label="이름"
                  variant="email"
                  placeholder=""
                  value={userInfo.userNm || ''}
                  onChange={() => {}}
                  disabled
              />
              <div className="absolute right-3 top-[38px] text-[#949494] text-sm">SNS 계정 정보</div>
            </div>

            {/* 이메일 (읽기 전용) */}
            {userInfo.email && (
                <div className="relative">
                  <FormInput
                      label="이메일"
                      variant="email"
                      placeholder=""
                      value={userInfo.email}
                      onChange={() => {}}
                      disabled
                  />
                  <div className="absolute right-3 top-[38px] text-[#949494] text-sm">SNS 계정 정보</div>
                </div>
            )}

            {/* 전화번호 */}
            <Controller
                name="phoneNum"
                control={control}
                rules={{
                  required: '전화번호를 입력해주세요',
                  pattern: {
                    value: /^010-\d{4}-\d{4}$/,
                    message: '010-0000-0000 형식으로 입력해주세요',
                  },
                }}
                render={({ field, fieldState }) => (
                    <div className="relative">
                      <FormInput
                          label="전화번호"
                          variant="phone"
                          placeholder="010-0000-0000"
                          value={field.value}
                          onChange={field.onChange}
                          state={
                            fieldState.error
                                ? 'error'
                                : phoneValidation
                                    ? phoneValidation.isValid
                                        ? 'success'
                                        : 'error'
                                    : 'default'
                          }
                          errorMessage={
                              fieldState.error?.message ||
                              (phoneValidation && !phoneValidation.isValid ? phoneValidation.message : '')
                          }
                      />
                      {phoneValidation && phoneValidation.isValid && (
                          <div className="text-green-600 text-sm mt-1">✓ 사용 가능한 핸드폰번호입니다</div>
                      )}
                    </div>
                )}
            />

            {/* 비밀번호 */}
            <Controller
                name="password"
                control={control}
                rules={{
                  required: '비밀번호를 입력해주세요',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: '8자리 이상, 소문자, 숫자, 특수문자를 포함해야 합니다',
                  },
                }}
                render={({ field, fieldState }) => (
                    <FormInput
                        label="비밀번호"
                        variant="password"
                        placeholder="비밀번호를 입력하세요"
                        value={field.value}
                        onChange={field.onChange}
                        state={fieldState.error ? 'error' : 'default'}
                        errorMessage={fieldState.error?.message}
                    />
                )}
            />

            <Button
                type="submit"
                className="w-[343px] h-[50px] mt-4"
                disabled={!!phoneValidation && !phoneValidation.isValid}
            >
              회원가입 완료
            </Button>
          </form>
        </div>
    );
  }

  return null;
};

export default SnsCallback;
