// async 함수들을 감싸서 catch를 한번에 끝내는 함수
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
};
