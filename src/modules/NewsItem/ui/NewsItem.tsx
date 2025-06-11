import styles from "./NewsItem.module.scss";

export interface NewsItemType {
    title: string;
    text: string;
    time: string;
    link: string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

const NewsItem = ({title, text, time, link}: NewsItemType) => {
    return (
        <div className={styles.NewsItem} onClick={() => window.open(link, '_blank')}>
            <img className="absolute w-[100px] h-[74px] left-[0px] top-[28px]" src="image.png" alt={title} />
            <h1>{title}</h1>
            <p>{text}</p>
            <span>{formatDate(time)}</span>
        </div>
    )
}

export default NewsItem;