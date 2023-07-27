export const descriptionAndHashtag = (comment: string) => {
    const cmtArr = comment.split(' ');
    return {
        description: cmtArr.filter(item => item[0] !== '#'),
        hashtag: cmtArr.filter(item => item[0] === '#'),
    }
}