import { useContext } from "react";
import SidebarItem from "./sidebar-item.component";
import SidebarItemContainer from "./sidebar-item-container.component";

import programRoutes from "../../constants/program-routes.constant";
import externalRoutes from "../../constants/external-routes.constant";
import useCurrentPath from "../../hooks/useCurrentPath";
import { AuthenticationContext } from "../../contexts/authentication-context/authentication.context";
import "./sidebar.styles.css";

const Sidebar = () => {
  const checkCurrentPath = useCurrentPath();
  const { user } = useContext(AuthenticationContext);

  return (
    <div className="border-end shadow sidebar-container d-none d-lg-flex">
      <div className="overflow-auto p-3 w-320px">
        <div className="d-flex flex-column justify-content-center flex-grow-1">
          <div>
            <h2 className="display-6 pt-2 pb-3">FizMat</h2>
          </div>
          <hr className="text-muted" />
          <SidebarItem
            active={checkCurrentPath(programRoutes.profile())}
            className="lead mb-3"
            label="Прогресс"
            href={programRoutes.profile()}
            iconName="home"
          />
          <SidebarItemContainer
            className="lead mb-3"
            label="Тесты"
            iconName="exam"
          >
            <SidebarItem
              active={
                checkCurrentPath(programRoutes.indexAllExams()) ||
                checkCurrentPath(
                  programRoutes.examiningQuestion(":examId", ":questionId")
                ) ||
                checkCurrentPath(programRoutes.examiningOverview(":examId")) ||
                checkCurrentPath(
                  programRoutes.showParticipant(":examId", ":participantId")
                )
              }
              className="lead my-2"
              label="Все тесты"
              href={programRoutes.indexAllExams()}
            />
            {user && user.permissions.includes('create-exams') ?
            <SidebarItem
              active={
                checkCurrentPath(programRoutes.indexCreatedExams()) ||
                checkCurrentPath(programRoutes.indexParticipants(":examId")) ||
                checkCurrentPath(programRoutes.updateExam(":examId"))
              }
              className="lead my-2"
              label="Созданные тесты"
              href={programRoutes.indexCreatedExams()}
            /> : <SidebarItem
                  active={false}
                  className="lead my-2 d-none"
                  label="Создать тест"
                  href={''}
                />}
            {user && user.permissions.includes('create-exams') ?
            <SidebarItem
              active={checkCurrentPath(programRoutes.createExam())}
              className="lead my-2"
              label="Создать тест"
              href={programRoutes.createExam()}
            /> : <SidebarItem
                  active={false}
                  className="lead my-2 d-none"
                  label="Создать тест"
                  href={''}
                />}
            <SidebarItem
              active={checkCurrentPath(programRoutes.indexParticipatedExams())}
              className="lead my-2"
              label="Пройденные тесты"
              href={programRoutes.indexParticipatedExams()}
            />
          </SidebarItemContainer>
          <SidebarItem
            active={checkCurrentPath(programRoutes.randomExam())}
            className="lead mb-3"
            label="Генерируемые тесты"
            href={programRoutes.randomExam()}
            iconName="exam"
          />
          <SidebarItem
            active={checkCurrentPath(programRoutes.settings())}
            className="lead mb-3"
            label="Настройки"
            href={programRoutes.settings()}
            iconName="settings"
          />
          <hr className="mt-auto text-muted" />
          <SidebarItem
            active={false}
            className="lead mb-3"
            label="Контакты"
            href={externalRoutes.help()}
            external={true}
            iconName="help"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
